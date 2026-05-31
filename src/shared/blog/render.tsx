import React from 'react';
import Markdoc from '@markdoc/markdoc';

import {
  CustomMarkdocComponents,
  CustomMarkdocTags,
} from '@/shared/blog/custom-components';
import { MarkdocNodes } from '@/shared/blog/markdoc-nodes';

export function renderMarkdoc(source: string) {
  const ast = Markdoc.parse(source);
  const config = {
    tags: {
      ...CustomMarkdocTags,
    },
    nodes: {
      ...MarkdocNodes,
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
