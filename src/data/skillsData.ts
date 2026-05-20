import type { Skill } from '../types';

export const skillsData: Skill[] = [
  { name: 'React', level: 98, icon: '⚛️', category: 'Frontend' },
  { name: 'Vue.js', level: 95, icon: '💚', category: 'Frontend' },
  { name: 'Next.js', level: 96, icon: '▲', category: 'Frontend' },
  { name: 'JavaScript', level: 99, icon: '📜', category: 'Frontend' },
  { name: 'TypeScript', level: 97, icon: '🔷', category: 'Frontend' },
  { name: 'Tailwind CSS', level: 98, icon: '🎨', category: 'Frontend' },
  { name: 'PHP', level: 99, icon: '🐘', category: 'Backend' },
  { name: 'Laravel', level: 98, icon: '🔴', category: 'Backend' },
  { name: 'Node.js', level: 95, icon: '🟢', category: 'Backend' },
  { name: 'Python', level: 92, icon: '🐍', category: 'Backend' },
  { name: 'GraphQL', level: 93, icon: '◈', category: 'Backend' },
  { name: 'REST APIs', level: 99, icon: '🔗', category: 'Backend' },
  { name: 'MySQL', level: 98, icon: '🗄️', category: 'Database' },
  { name: 'PostgreSQL', level: 96, icon: '🐘', category: 'Database' },
  { name: 'MongoDB', level: 93, icon: '🍃', category: 'Database' },
  { name: 'Redis', level: 91, icon: '⚡', category: 'Database' },
  { name: 'Docker', level: 92, icon: '🐳', category: 'DevOps' },
  { name: 'Kubernetes', level: 87, icon: '☸️', category: 'DevOps' },
  { name: 'AWS', level: 94, icon: '☁️', category: 'DevOps' },
  { name: 'CI/CD', level: 95, icon: '🔄', category: 'DevOps' },
  { name: 'Git / GitHub', level: 98, icon: '📦', category: 'Tools' },
  { name: 'Figma', level: 85, icon: '🎯', category: 'Tools' },
];

export const skillCategories = ['Frontend', 'Backend', 'Database', 'DevOps', 'Tools'] as const;
