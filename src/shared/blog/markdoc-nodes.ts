import type { Config, Node, RenderableTreeNode } from '@markdoc/markdoc';
import { nodes, Tag } from '@markdoc/markdoc';

function generateID(
  children: Array<RenderableTreeNode>,
  attributes: Record<string, unknown>
) {
  if (attributes.id && typeof attributes.id === 'string') {
    return attributes.id;
  }

  return children
    .filter((child) => typeof child === 'string')
    .join(' ')
    .replace(/[?]/g, '')
    .replace(/\s+/g, '-')
    .toLowerCase();
}

const heading = {
  children: ['inline'],
  attributes: {
    id: { type: String },
    level: { type: Number, required: true, default: 1 },
  },
  transform(node: Node, config: Config) {
    const attributes = node.transformAttributes(config);
    const children = node.transformChildren(config);
    const id = generateID(children, attributes);
    const headingAttributes = { ...attributes };
    delete headingAttributes.level;

    return new Tag(
      `h${node.attributes.level}`,
      { ...headingAttributes, id },
      children
    );
  },
};

// Images render as a click-to-zoom lightbox (ZoomableImage) instead of a bare
// <img>, so small screenshots are readable on a projector. Like the `tree` fence,
// this is a node transform — author writes native Markdown `![alt](src)`, so it
// needs no Keystatic block or tag schema, only the CustomMarkdocComponents entry.
const image = {
  attributes: {
    src: { type: String, required: true },
    alt: { type: String },
    title: { type: String },
  },
  transform(node: Node, config: Config) {
    return new Tag('ZoomableImage', node.transformAttributes(config));
  },
};

const fence = {
  attributes: {
    content: { type: String, required: true },
    language: { type: String },
  },
  transform(node: Node) {
    // A ```tree fence renders as a styled file tree instead of a code block.
    if (node.attributes.language === 'tree') {
      return new Tag('FileTree', { content: node.attributes.content });
    }
    return new Tag('CodeBlock', {
      code: node.attributes.content,
      language: node.attributes.language,
    });
  },
};

// A link that opens in a new tab. Used for slide decks (opt-in via renderMarkdoc)
// so attendees don't navigate away from the live presentation when they open a
// link from a slide; `rel` hardens the spawned tab. Keeps the default link
// attribute schema (href required, title) for validation.
const newTabLink = {
  ...nodes.link,
  transform(node: Node, config: Config) {
    const attributes = node.transformAttributes(config);
    const children = node.transformChildren(config);
    return new Tag(
      'a',
      { ...attributes, target: '_blank', rel: 'noopener noreferrer' },
      children
    );
  },
};

export const MarkdocNodes = {
  fence,
  heading,
  image,
};

/** Opt-in `link` override that opens links in a new tab (see renderMarkdoc). */
export const NewTabLinkNode = newTabLink;
