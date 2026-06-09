import Markdoc, { type Node } from '@markdoc/markdoc';

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
