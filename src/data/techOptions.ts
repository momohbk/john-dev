import type { TechOption } from '../types';

export const techOptions: TechOption[] = [
  { value: 'react', label: 'React', color: '#61DAFB' },
  { value: 'laravel', label: 'Laravel', color: '#FF2D20' },
  { value: 'php', label: 'PHP', color: '#777BB4' },
  { value: 'javascript', label: 'JavaScript', color: '#F7DF1E' },
  { value: 'typescript', label: 'TypeScript', color: '#3178C6' },
  { value: 'html', label: 'HTML5', color: '#E34F26' },
  { value: 'css', label: 'CSS3', color: '#1572B6' },
  { value: 'tailwind', label: 'Tailwind CSS', color: '#06B6D4' },
  { value: 'mysql', label: 'MySQL', color: '#4479A1' },
  { value: 'postgresql', label: 'PostgreSQL', color: '#336791' },
  { value: 'node', label: 'Node.js', color: '#339933' },
  { value: 'mongodb', label: 'MongoDB', color: '#47A248' },
  { value: 'redux', label: 'Redux', color: '#764ABC' },
  { value: 'nextjs', label: 'Next.js', color: '#000000' },
  { value: 'firebase', label: 'Firebase', color: '#FFCA28' },
  { value: 'docker', label: 'Docker', color: '#2496ED' },
  { value: 'vue', label: 'Vue.js', color: '#4FC08D' },
  { value: 'python', label: 'Python', color: '#3776AB' },
  { value: 'graphql', label: 'GraphQL', color: '#E535AB' },
  { value: 'aws', label: 'AWS', color: '#FF9900' },
  { value: 'redis', label: 'Redis', color: '#DC382D' },
  { value: 'sqlite', label: 'SQLite', color: '#044A64' },
  { value: 'express', label: 'Express', color: '#2596be' },
  { value: 'kubernetes', label: 'Kubernetes', color: '#326CE5' },
];

export const techOptionsMap = new Map(techOptions.map((t) => [t.value, t]));

export function getTechInfo(value: string): TechOption {
  return techOptionsMap.get(value) ?? { value, label: value, color: '#6366f1' };
}
