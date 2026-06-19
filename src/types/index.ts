export interface TechOption {
  value: string;
  label: string;
  color: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  techStack: string[];
  liveUrl: string;
  githubUrl: string;
  featured: boolean;
}

export interface ClientProject {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  techStack: string[];
  liveUrl: string;
  githubUrl: string;
  features: string[];
}

export interface Skill {
  name: string;
  level: number;
  icon: string;
  category: SkillCategory;
}

export type SkillCategory = 'Frontend' | 'Backend' | 'Database' | 'DevOps' | 'Tools';
