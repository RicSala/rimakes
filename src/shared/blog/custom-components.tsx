import type { ComponentType } from 'react';
import { Tag, type Config, type Node, type Schema } from '@markdoc/markdoc';

import {
  MarkdocCodeBlock,
  MarkdocCodeEditor,
} from '@/shared/blog/components';
import { Columns, Column } from '@/features/presentations/Columns';
import { FileTree } from '@/features/presentations/FileTree';
import { Match, MatchPair } from '@/features/presentations/Match';
import {
  Quiz,
  QuizQuestion,
  QuizOption,
  QuizExplanation,
} from '@/features/presentations/Quiz';
import { Timer } from '@/features/presentations/Timer';
import { ZoomableImage } from '@/features/presentations/ZoomableImage';
import { Callout } from '@/shared/components/Callout';
import { Highlight } from '@/shared/components/Highlight';
import { Prompt } from '@/shared/components/Prompt';

type Component = ComponentType<Record<string, unknown>>;

// Inline-level Markdoc node types. A tag whose body is written on one line gets
// these as direct children (not wrapped in a paragraph), so any tag that accepts
// rich inline content must whitelist them or validation rejects the content.
const INLINE_CHILDREN = [
  'inline',
  'text',
  'strong',
  'em',
  's',
  'code',
  'link',
  'image',
  'hardbreak',
  'softbreak',
  'tag',
];

export const CustomMarkdocComponents: Record<string, Component> = {
  Callout: Callout as Component,
  // `{% highlight %}` is an inline marker-pen highlight (default yellow). It's a
  // Keystatic `mark`, so it's authored by selecting text and toggling the toolbar
  // button — the `color` attribute is set in source for the rare non-yellow run.
  Highlight: Highlight as Component,
  CodeBlock: MarkdocCodeBlock as Component,
  CodeEditor: MarkdocCodeEditor as Component,
  Prompt: Prompt as Component,
  // `{% timer %}` is a synced countdown; presenter-driven on /control, display
  // only on viewers. It reads the deck slug / publish secret from context.
  Timer: Timer as Component,
  // `{% columns %}` / `{% column %}` are a side-by-side card layout for
  // comparisons (e.g. models). Styled from design tokens so they re-theme.
  Columns: Columns as Component,
  Column: Column as Component,
  // `FileTree` is the render target for a ```tree fence (see markdoc-nodes.ts):
  // a styled file tree from indented text.
  FileTree: FileTree as Component,
  // `ZoomableImage` is the render target for the built-in `image` node (see
  // markdoc-nodes.ts): an inline image that opens a full-screen lightbox on click.
  ZoomableImage: ZoomableImage as Component,
  // `{% quiz %}` is a self-check (one or more `{% question %}`); `{% option %}` /
  // `{% explanation %}` live inside each question. Each viewer answers locally (no
  // broadcast). inline | modal. The Quiz*/passthrough renderers below are only a
  // fallback — the quiz transform folds these tags into Quiz's `questions` prop.
  Quiz: Quiz as Component,
  QuizQuestion: QuizQuestion as Component,
  QuizOption: QuizOption as Component,
  QuizExplanation: QuizExplanation as Component,
  // `{% match %}` is a self-check where the audience connects each `{% pair %}`'s
  // left label to its right label (two columns, the right one scrambled). Like
  // the quiz, its nested `pair` tags are folded into a `pairs` prop at transform
  // time (they can't be read as React children across the RSC boundary). MatchPair
  // is only a fallback for a `pair` authored outside a match.
  Match: Match as Component,
  MatchPair: MatchPair as Component,
  // `{% slide %}` carries per-slide chrome (background, corner tags). It's
  // stripped before render by extractSlideMeta; this no-op renderer is a safety
  // net so a stray/misplaced directive can't break validation.
  SlideDirective: (() => null) as Component,
  // `{% notes %}` is presenter-only speaker notes: extractSlideMeta pulls it out
  // and only the /control screen renders it. This no-op renderer is a safety net
  // so a stray/misplaced notes block renders to nothing (never leaking to the
  // audience viewer) instead of breaking validation.
  SpeakerNotes: (() => null) as Component,
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
  // Inline highlight (a Keystatic `mark`). `inline: true` so it renders within a
  // paragraph instead of being treated as a block; INLINE_CHILDREN lets it wrap
  // text plus other inline marks (bold, links, code…). `color` defaults to yellow.
  highlight: {
    render: 'Highlight',
    inline: true,
    children: INLINE_CHILDREN,
    attributes: {
      color: {
        type: String,
        matches: ['yellow', 'green', 'blue', 'pink', 'orange'],
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
  slide: {
    render: 'SlideDirective',
    selfClosing: true,
    attributes: {
      bg: { type: String },
      tags: { type: String },
      width: { type: String },
      // Lets the audience navigate to this slide on their own (covered material).
      public: { type: Boolean },
      // Marks this slide as a section/module header; groups the review index.
      section: { type: String },
    },
  },
  columns: {
    render: 'Columns',
    children: ['tag', 'paragraph'],
    attributes: {},
  },
  column: {
    render: 'Column',
    children: ['paragraph', 'list', 'fence', 'heading', 'tag'],
    attributes: {
      title: { type: String },
      subtitle: { type: String },
      badge: { type: String },
      highlight: { type: Boolean },
    },
  },
  notes: {
    render: 'SpeakerNotes',
    children: ['paragraph', 'list', 'fence', 'heading', 'tag'],
    attributes: {},
  },
  timer: {
    render: 'Timer',
    selfClosing: true,
    attributes: {
      minutes: { type: Number },
      seconds: { type: Number },
      id: { type: String },
      label: { type: String },
    },
  },
  // The quiz folds its nested `question` / `option` / `explanation` tags into a
  // structured `questions` prop at transform time. We can't read them as React
  // children at runtime: Markdoc client components are React.lazy-wrapped across
  // the RSC boundary, so the parent could never match them by identity.
  // `deepRender` renders the Tag bodies we stash in props into React nodes.
  quiz: {
    render: 'Quiz',
    children: ['tag', 'paragraph'],
    attributes: {
      title: { type: String },
      // Legacy single-question shorthand: a `question` attribute + options
      // directly under the quiz (no `{% question %}` wrapper).
      question: { type: String },
      mode: { type: String, matches: ['inline', 'modal'], default: 'inline' },
    },
    transform(node: Node, config: Config) {
      const attributes = node.transformAttributes(config);

      // Collect option/explanation tags anywhere under `root` (without descending
      // into a nested question). Consecutive inline tags get wrapped in a
      // paragraph/inline by the parser, so we must walk descendants.
      const collectQuestion = (root: Node) => {
        const options: Array<{ correct: boolean; body: unknown }> = [];
        let explanation: unknown = null;
        const walk = (current: Node) => {
          for (const child of current.children ?? []) {
            if (child.type !== 'tag') {
              walk(child);
            } else if (child.tag === 'option') {
              options.push({
                correct: child.transformAttributes(config).correct === true,
                body: child.transformChildren(config),
              });
            } else if (child.tag === 'explanation') {
              explanation = child.transformChildren(config);
            } else if (child.tag !== 'question') {
              walk(child);
            }
          }
        };
        walk(root);
        return { options, explanation };
      };

      // Find `{% question %}` tags at any depth (they may be wrapped in a
      // paragraph when authored compactly).
      const questions: Array<{
        text: unknown;
        options: Array<{ correct: boolean; body: unknown }>;
        explanation: unknown;
      }> = [];
      const findQuestions = (current: Node) => {
        for (const child of current.children ?? []) {
          if (child.type === 'tag' && child.tag === 'question') {
            questions.push({
              text: child.transformAttributes(config).text,
              ...collectQuestion(child),
            });
          } else if (child.type !== 'tag') {
            findQuestions(child);
          }
        }
      };
      findQuestions(node);

      // No explicit `{% question %}` → single question from the `question`
      // attribute and the options/explanation directly inside the quiz.
      if (questions.length === 0) {
        const single = collectQuestion(node);
        if (single.options.length) {
          questions.push({ text: attributes.question, ...single });
        }
      }

      return new Tag(
        'Quiz',
        { title: attributes.title, mode: attributes.mode, questions },
        []
      );
    },
  },
  question: {
    render: 'QuizQuestion',
    children: [...INLINE_CHILDREN, 'paragraph', 'list', 'fence'],
    attributes: {
      text: { type: String },
    },
  },
  // Markdoc puts an option's content directly under the tag as inline nodes when
  // it's written on one line (`{% option %}**x**{% /option %}`), or as a paragraph
  // when block-authored — so allow both inline marks and block content.
  option: {
    render: 'QuizOption',
    children: [...INLINE_CHILDREN, 'paragraph', 'list', 'fence'],
    attributes: {
      correct: { type: Boolean },
    },
  },
  explanation: {
    render: 'QuizExplanation',
    children: [...INLINE_CHILDREN, 'paragraph', 'list', 'fence', 'heading', 'tag'],
    attributes: {},
  },
  // `{% match %}` folds its nested self-closing `{% pair %}` tags into a
  // structured `pairs` prop at transform time — same reason as the quiz: Markdoc
  // client components are React.lazy-wrapped across the RSC boundary, so Match
  // can't read the pairs as React children. Each pair's labels are plain strings,
  // so no deepRender is needed (unlike the quiz's rich option bodies).
  match: {
    render: 'Match',
    children: ['tag', 'paragraph'],
    attributes: {
      title: { type: String },
      instructions: { type: String },
    },
    transform(node: Node, config: Config) {
      const attributes = node.transformAttributes(config);
      const pairs: Array<{ left: string; right: string }> = [];
      const walk = (current: Node) => {
        for (const child of current.children ?? []) {
          if (child.type === 'tag' && child.tag === 'pair') {
            const pairAttributes = child.transformAttributes(config);
            if (
              typeof pairAttributes.left === 'string' &&
              typeof pairAttributes.right === 'string'
            ) {
              pairs.push({ left: pairAttributes.left, right: pairAttributes.right });
            }
          } else if (child.type !== 'tag') {
            walk(child);
          }
        }
      };
      walk(node);

      return new Tag(
        'Match',
        {
          title: attributes.title,
          instructions: attributes.instructions,
          pairs,
        },
        []
      );
    },
  },
  pair: {
    render: 'MatchPair',
    selfClosing: true,
    attributes: {
      left: { type: String },
      right: { type: String },
    },
  },
};
