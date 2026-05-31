export type PortfolioProject = {
  slug: string;
  title: string;
  description: string;
  startDate?: string;
  endDate?: string;
  link?: string;
  githubLink?: string;
  docsLink?: string;
  status?: string;
  image?: string;
  technologies: string[];
};

export type PortfolioTechnology = {
  id: string;
  icon?: string;
  title: string;
};

const TECHNOLOGY_ICON_IDS = new Set([
  'betterauth',
  'claude',
  'docker',
  'git',
  'mongodb',
  'next-js',
  'node-js',
  'openai',
  'postgress',
  'prisma',
  'puppeteer',
  'radix',
  'react',
  'shadcn',
  'typescript',
  'vercel',
  'vitest',
]);

export const PORTFOLIO_PROJECTS: PortfolioProject[] = [
  {
    slug: 'vetiens',
    title: 'Vetiens',
    description: 'Toma de notas automática a través de la voz.',
    startDate: '2024-03-01T00:00:00.000Z',
    endDate: '2025-03-01T00:00:00.000Z',
    link: 'https://vetiens.com',
    status: '😴 sleeping',
    image:
      '/images/projects/vetiens.jpg',
    technologies: [
      'AI Development',
      'BetterAuth',
      'Next.js',
      'Node.js',
      'OpenAi',
      'Postgress',
      'Prisma',
      'React',
      'Shadcn',
      'Tanstack Query',
      'Vercel',
    ],
  },
  {
    slug: 'logotime',
    title: 'Logoti.me',
    description:
      'One of my first projects 🫠. Just wanted to see if I was able to do it with what I had learn so far',
    startDate: '2024-01-01T00:00:00.000Z',
    endDate: '2024-02-01T00:00:00.000Z',
    link: 'https://logo-maker-pied.vercel.app/',
    status: '💀 discontinued',
    image:
      '/images/projects/logotime.jpg',
    technologies: [
      'AI Development',
      'MongoDB',
      'Next.js',
      'Node.js',
      'Prisma',
      'React',
      'Shadcn',
      'Tanstack Query',
      'Typescript',
      'Vercel',
    ],
  },
  {
    slug: 'flowpost',
    title: 'Flowpost',
    description:
      'Create Linkedin carousels in seconds. My first “real project”, because of its challenges, learnings, and amount of daily users.',
    startDate: '2024-10-14T00:00:00.000Z',
    endDate: '2025-10-14T00:00:00.000Z',
    link: 'https://flowpost.io',
    status: '🚧 wip',
    image:
      '/images/projects/flowpost.jpg',
    technologies: ['Next.js', 'Node.js', 'Postgress', 'Prisma', 'React', 'Docker'],
  },
  {
    slug: 'tattuo',
    title: 'Tattuo',
    description:
      'Create original tattoos in seconds. I am still convinced this one has value and will one day be monetized 🤞🏻',
    startDate: '2024-10-01T00:00:00.000Z',
    endDate: '2025-03-01T00:00:00.000Z',
    link: 'https://tatuame.vercel.app/',
    status: '😴 sleeping',
    image:
      '/images/projects/tattuo.jpg',
    technologies: [
      'NextAuth',
      'Git',
      'MongoDB',
      'Next.js',
      'OpenAi',
      'Shadcn',
      'Tanstack Query',
    ],
  },
];

export const PORTFOLIO_TECHNOLOGIES: PortfolioTechnology[] = [
  'Next.js',
  'React',
  'Typescript',
  'Node.js',
  'Postgress',
  'Docker',
  'Tanstack Query',
  'AI Development',
  'Vercel',
  'Prisma',
  'MongoDB',
  'Puppeteer',
  'BetterAuth',
  'Radix',
  'Shadcn',
  'Claude',
  'OpenAi',
  'Git',
  'Vitest',
].map((title) => ({
  id: title.toLowerCase().replace(/\W+/g, '-'),
  title,
})).map((technology) => ({
  ...technology,
  icon: TECHNOLOGY_ICON_IDS.has(technology.id)
    ? `/icons/technologies/${technology.id}.svg`
    : undefined,
}));
