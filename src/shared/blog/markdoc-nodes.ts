import type { Config, Node, RenderableTreeNode } from '@markdoc/markdoc';
import { Tag } from '@markdoc/markdoc';

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

const fence = {
  attributes: {
    content: { type: String, required: true },
    language: { type: String },
  },
  transform(node: Node) {
    return new Tag('CodeBlock', {
      code: node.attributes.content,
      language: node.attributes.language,
    });
  },
};

export const MarkdocNodes = {
  fence,
  heading,
};
