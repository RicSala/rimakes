import type { ReactNode } from 'react';

type TreeNode = {
  name: string;
  isFolder: boolean;
  comment: string | null;
  children: TreeNode[];
};

function leadingSpaces(line: string): number {
  const match = line.match(/^ */);
  return match ? match[0].length : 0;
}

function parseTree(content: string): TreeNode[] {
  let lines = content
    .replace(/\t/g, '  ')
    .split('\n')
    .filter((line) => line.trim().length > 0);
  if (lines.length === 0) return [];

  // Dedent so an accidentally-indented block still parses correctly.
  const base = Math.min(...lines.map(leadingSpaces));
  if (base > 0) lines = lines.map((line) => line.slice(base));

  const indents = lines.map(leadingSpaces).filter((n) => n > 0);
  const unit = indents.length > 0 ? Math.min(...indents) : 2;

  const roots: TreeNode[] = [];
  const stack: Array<{ depth: number; node: TreeNode }> = [];

  for (const line of lines) {
    const depth = Math.round(leadingSpaces(line) / unit);
    let text = line.trim();

    // Optional trailing "  # annotation".
    let comment: string | null = null;
    const match = text.match(/^(.*?)\s+#\s?(.*)$/);
    if (match) {
      text = match[1].trim();
      comment = match[2].trim();
    }

    const isFolder = text.endsWith('/');
    const name = isFolder ? text.slice(0, -1) : text;
    const node: TreeNode = { name, isFolder, comment, children: [] };

    while (stack.length > 0 && stack[stack.length - 1].depth >= depth) {
      stack.pop();
    }
    if (stack.length === 0) {
      roots.push(node);
    } else {
      stack[stack.length - 1].node.children.push(node);
    }
    stack.push({ depth, node });
  }

  // A node with children is a folder even if it lacked a trailing slash.
  const markFolders = (nodes: TreeNode[]) => {
    for (const node of nodes) {
      if (node.children.length > 0) node.isFolder = true;
      markFolders(node.children);
    }
  };
  markFolders(roots);

  return roots;
}

function renderRows(
  nodes: TreeNode[],
  prefix: string,
  depth: number,
  out: ReactNode[]
) {
  nodes.forEach((node, index) => {
    const isLast = index === nodes.length - 1;
    const branch = depth === 0 ? '' : isLast ? '└── ' : '├── ';
    out.push(
      <div key={out.length} className='whitespace-pre'>
        <span className='text-muted-foreground'>{prefix + branch}</span>
        <span
          className={
            node.isFolder ? 'font-semibold text-primary' : 'text-card-foreground'
          }
        >
          {node.name}
          {node.isFolder ? '/' : ''}
        </span>
        {node.comment ? (
          <span className='text-muted-foreground'>{`  # ${node.comment}`}</span>
        ) : null}
      </div>
    );
    const childPrefix = depth === 0 ? '' : prefix + (isLast ? '    ' : '│   ');
    renderRows(node.children, childPrefix, depth + 1, out);
  });
}

/**
 * Renders a ```tree fenced block (routed here by the `fence` transform in
 * markdoc-nodes.ts) as a polished file tree: indentation = nesting, a trailing
 * `/` marks a folder, and `  # …` adds a muted annotation. Folders are
 * emphasized and connector lines are drawn automatically. Pure render (no
 * client JS); colors come from design tokens, so it re-themes with the slide.
 */
export function FileTree({ content }: { content?: string }) {
  const roots = parseTree(content ?? '');
  const rows: ReactNode[] = [];
  renderRows(roots, '', 0, rows);
  return (
    <div className='not-prose my-5 overflow-x-auto rounded-xl border border-border bg-card p-5 font-mono text-sm leading-relaxed text-card-foreground shadow-sm sm:text-base'>
      {rows}
    </div>
  );
}
