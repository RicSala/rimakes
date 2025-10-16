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
