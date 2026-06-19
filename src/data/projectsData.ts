import type { Project } from '../types';

export const projectsData: Project[] = [
  {
    id: 1,
    title: 'DineSync',
    description: 'Restaurant management platform built with Vue 3, Express, and MySQL. Features table booking, order management, menu management, real-time availability tracking, and an admin dashboard panel.',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
    techStack: ['vue', 'typescript', 'node', 'mysql', 'tailwind', 'express'],
    liveUrl: 'https://github.com/momohbk/dinesync',
    githubUrl: 'https://github.com/momohbk/dinesync',
    featured: true,
  },
  {
    id: 2,
    title: 'BagStyle DZ',
    description: 'Arabic e-commerce platform built with React 19, Express, and MySQL. Features guest checkout, order tracking by ID+phone, RTL/Arabic UI, admin dashboard, product variants, reviews moderation, banners management, and marketing pixels integration.',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80',
    techStack: ['react', 'typescript', 'node', 'mysql', 'express', 'tailwind'],
    liveUrl: 'https://github.com/momohbk/john-dev/tree/main/projects/shopflow',
    githubUrl: '#',
    featured: true,
  },
];
