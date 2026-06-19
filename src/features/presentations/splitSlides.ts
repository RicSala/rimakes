import Markdoc, { type Node } from '@markdoc/markdoc';

import type { SlideMeta } from './SlideStage';

/** Concatenate the plain text of a node's inline descendants (text nodes). */
function collectText(node: Node): string {
  if (node.type === 'text') {
    const content = (node.attributes as { content?: unknown } | undefined)
      ?.content;
    return typeof content === 'string' ? content : '';
  }
  return (node.children ?? []).map(collectText).join('');
}

/** The text of the first heading among a slide's top-level nodes, if any. */
function firstHeadingText(nodes: Node[]): string | undefined {
  for (const node of nodes) {
    if (node.type === 'heading') {
      const text = collectText(node).replace(/\s+/g, ' ').trim();
      if (text) return text;
    }
  }
  return undefined;
}

/**
 * Split a parsed Markdoc document into one document per slide, breaking on
 * top-level thematic breaks (`---`). Because the document is already parsed, a
 * `---` inside a fenced code block stays part of the fence and never splits.
 *
 * Returns the original document as a single slide if there are no breaks.
 */
export function splitNodeIntoSlides(doc: Node): Node[] {
  const groups: Node[][] = [[]];

  for (const child of doc.children) {
    if (child.type === 'hr') {
      groups.push([]);
    } else {
      groups[groups.length - 1].push(child);
    }
  }

  const slides = groups
    .filter((children) => children.length > 0)
    .map((children) => new Markdoc.Ast.Node('document', {}, children));

  return slides.length > 0 ? slides : [doc];
}

/**
 * Pull a slide's chrome out of a leading `{% slide bg="brand" tags="A, B" /%}`
 * directive and its presenter-only `{% notes %}…{% /notes %}` block, returning
 * the content with both removed. Slide-level settings (background scheme, corner
 * tags) are applied by `SlideStage`, not rendered inline, because they theme the
 * whole stage — something content-level markup can't reach. The `notes` block is
 * returned separately as its own document so ONLY the presenter (/control) screen
 * renders it; because it never goes into the inline `node`, it never reaches the
 * audience viewer's HTML. Any top-level `slide`/`notes` is stripped regardless of
 * position; the first of each wins.
 */
export function extractSlideMeta(slide: Node): {
  node: Node;
  meta: SlideMeta;
  notes?: Node;
} {
  const meta: SlideMeta = {};
  const kept: Node[] = [];
  let notes: Node | undefined;

  for (const child of slide.children) {
    if (child.type === 'tag' && child.tag === 'slide') {
      const attrs = (child.attributes ?? {}) as Record<string, unknown>;
      if (meta.bg === undefined && typeof attrs.bg === 'string' && attrs.bg !== 'none') {
        meta.bg = attrs.bg;
      }
      if (meta.tags === undefined && typeof attrs.tags === 'string') {
        const labels = attrs.tags
          .split(',')
          .map((label) => label.trim())
          .filter(Boolean);
        if (labels.length > 0) meta.tags = labels;
      }
      if (
        meta.width === undefined &&
        typeof attrs.width === 'string' &&
        attrs.width !== 'normal'
      ) {
        meta.width = attrs.width;
      }
      if (meta.public === undefined && typeof attrs.public === 'boolean') {
        meta.public = attrs.public;
      }
      if (
        meta.section === undefined &&
        typeof attrs.section === 'string' &&
        attrs.section.trim()
      ) {
        meta.section = attrs.section.trim();
      }
      continue; // drop the directive from the rendered content
    }
    if (child.type === 'tag' && child.tag === 'notes') {
      // Keep the notes' inner content as a standalone document for the presenter
      // screen; never push it into `kept`, so the audience viewer never sees it.
      if (notes === undefined) {
        notes = new Markdoc.Ast.Node('document', {}, child.children);
      }
      continue;
    }
    kept.push(child);
  }

  // Derive a plain-text title from the slide's first heading, for the review
  // index. Headless slides (a bare callout/prompt) get none and fall back to
  // their slide number in the index.
  if (meta.title === undefined) {
    const title = firstHeadingText(kept);
    if (title) meta.title = title;
  }

  return { node: new Markdoc.Ast.Node('document', {}, kept), meta, notes };
}
