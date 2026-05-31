export const OPEN_SOURCE_PROJECTS: OpenSourceProject[] = [
  {
    name: 'tiny-machine',
    role: 'creator',
    description:
      'Lightweight TypeScript implementation of finite state machines inspired by XState. Built to provide a simpler, more accessible alternative for state management in React applications',
    githubUrl: 'https://github.com/rimakes/tiny-machine',
    docsUrl: 'https://www.npmjs.com/package/@tinystack/machine',
    imageUrl: 'https://tiny-machine.vercel.app/logo.png',
    tags: ['TypeScript', 'Finite State Machines', 'React'],
  },
  {
    name: 'tourista',
    role: 'creator',
    description:
      'React library for interactive product tours and onboarding flows using state machine architecture. Handles multi-page navigation, async steps, and complex tour flows',
    githubUrl: 'https://github.com/RicSala/tourista',
    docsUrl: 'https://docs.tourista.dev/getting-started/quick-start',
  },
];

export type OpenSourceProject = {
  name: string;
  role: 'creator' | 'contributor';
  githubUrl: string;
  docsUrl?: string;
  description?: string;
  imageUrl?: string;
  tags?: string[];
};

export type OpenSourceProjectCard = {
  id: string;
  title: string;
  description: string;
  githubLink?: string;
  docsLink?: string;
  imageUrl?: string;
  why?: string;
  role?: string;
  postPath?: string;
};

export const OPEN_SOURCE_PROJECT_CARDS: OpenSourceProjectCard[] = [
  {
    id: 'tiny-machine',
    title: 'tiny-machine',
    description:
      'Lightweight TypeScript implementation of finite state machines highly inspired by XState. Built to provide a simpler, more accessible alternative for state management in React applications.',
    githubLink: 'https://github.com/RicSala/machine',
    why: 'I wanted to use a state machine for the onboarding flow of Vetiens, and XState seemed like too much for my needs.',
    role: 'Creator',
    postPath: 'maquina-de-estados-finitos-en-typescript',
  },
  {
    id: 'tourista',
    title: 'Tourista',
    description:
      'Tourista is a React library that creates interactive product tours and onboarding flows. It uses a state machine architecture to manage tour progression, multi-page navigation, and async tour steps.',
    githubLink: 'https://github.com/RicSala/tourista',
    docsLink: 'https://docs.tourista.dev/getting-started/quick-start',
    why: 'I needed a tour library that worked well with Next.js, had nice transitions, supported async steps, and gave tiny-machine a real use case.',
    role: 'Creator',
  },
];
