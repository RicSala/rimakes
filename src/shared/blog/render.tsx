import React from 'react';
import Markdoc, { type Node } from '@markdoc/markdoc';

import {
  CustomMarkdocComponents,
  CustomMarkdocTags,
} from '@/shared/blog/custom-components';
import { MarkdocNodes, NewTabLinkNode } from '@/shared/blog/markdoc-nodes';

// A raw Markdoc string (legacy) or a pre-parsed node from the Keystatic reader
// (returned when reading the `content` field with `resolveLinkedFiles`).
export type MarkdocSource = string | { node: Node };

type RenderOptions = {
  /** Open links in a new tab — decks opt in so attendees don't navigate away. */
  openLinksInNewTab?: boolean;
};

export function renderMarkdoc(source: MarkdocSource, options?: RenderOptions) {
  const ast = typeof source === 'string' ? Markdoc.parse(source) : source.node;
  const config = {
    tags: {
      ...CustomMarkdocTags,
    },
    nodes: {
      ...MarkdocNodes,
      ...(options?.openLinksInNewTab ? { link: NewTabLinkNode } : {}),
    },
  };

  const errors = Markdoc.validate(ast, config);

  if (errors.length > 0) {
    throw new Error(errors.map((error) => error.error.message).join('\n'));
  }

  const content = Markdoc.transform(ast, config);

  return Markdoc.renderers.react(content, React, {
    components: CustomMarkdocComponents,
  });
}
