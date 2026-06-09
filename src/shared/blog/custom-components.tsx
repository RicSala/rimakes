import type { ComponentType } from 'react';
import type { Schema } from '@markdoc/markdoc';

import {
  MarkdocCodeBlock,
  MarkdocCodeEditor,
} from '@/shared/blog/components';
import { Callout } from '@/shared/components/Callout';
import { Prompt } from '@/shared/components/Prompt';

type Component = ComponentType<Record<string, unknown>>;

export const CustomMarkdocComponents: Record<string, Component> = {
  Callout: Callout as Component,
  CodeBlock: MarkdocCodeBlock as Component,
  CodeEditor: MarkdocCodeEditor as Component,
  Prompt: Prompt as Component,
};

export const CustomMarkdocTags: Record<string, Schema> = {
  callout: {
    render: 'Callout',
    children: ['paragraph', 'tag', 'list', 'fence'],
    attributes: {
      title: { type: String },
      emoji: { type: String },
      variant: {
        type: String,
        matches: ['default', 'info', 'warning', 'error', 'success'],
      },
    },
  },
  'code-editor': {
    render: 'CodeEditor',
    selfClosing: true,
    attributes: {
      title: { type: String },
    },
  },
  prompt: {
    render: 'Prompt',
    children: ['paragraph', 'fence', 'list', 'tag'],
    attributes: {
      title: { type: String },
    },
  },
};
