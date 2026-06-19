import type { ClientProject } from '../types';

export const clientProjectsData: ClientProject[] = [
  {
    id: 1,
    title: 'DineSync',
    subtitle: 'Restaurant Management Platform',
    description:
      'A full-featured restaurant management system with real-time table booking, menu management, order tracking, and an admin dashboard. Built with a robust MySQL backend, the platform handles reservations, menu item availability, and customer management with JWT-based authentication.',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
    techStack: ['vue', 'typescript', 'node', 'mysql', 'tailwind', 'express'],
    liveUrl: 'https://github.com/momohbk/dinesync',
    githubUrl: 'https://github.com/momohbk/dinesync',
    features: [
      'Real-time table reservations',
      'Menu management with availability',
      'Admin dashboard with analytics',
      'JWT authentication',
      'MySQL database with optimized queries',
    ],
  },
  {
    id: 2,
    title: 'BagStyle DZ',
    subtitle: 'Arabic E-Commerce Platform',
    description:
      'A complete e-commerce platform for a handbag store, featuring Arabic RTL UI, guest checkout, order tracking, and a full admin panel. Powered by MySQL with products, variants, reviews, banners, and marketing pixels — all managed through a RESTful Express API.',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80',
    techStack: ['react', 'typescript', 'node', 'mysql', 'tailwind', 'express'],
    liveUrl: 'https://github.com/momohbk/john-dev/tree/main/projects/shopflow',
    githubUrl: 'https://github.com/momohbk/john-dev/tree/main/projects/shopflow',
    features: [
      'Arabic RTL interface',
      'Guest checkout flow',
      'Order tracking by ID & phone',
      'Product variants & reviews',
      'MySQL with relational schema',
    ],
  },
];
