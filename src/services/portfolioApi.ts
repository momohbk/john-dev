import type { Project, Skill } from '../types';
import { projectsData as localProjects } from '../data/projectsData';
import { skillsData as localSkills } from '../data/skillsData';

const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com/momohbk/john-dev/main';
const DATA_URL = `${GITHUB_RAW_BASE}/data/portfolio.json`;

interface PortfolioData {
  projects: Project[];
  skills: Skill[];
}

let cachedData: PortfolioData | null = null;

async function fetchFromGitHub(): Promise<PortfolioData | null> {
  try {
    const response = await fetch(DATA_URL, {
      headers: { 'Accept': 'application/json' },
    });
    if (!response.ok) return null;
    return await response.json() as PortfolioData;
  } catch {
    return null;
  }
}

export async function getProjects(): Promise<Project[]> {
  if (cachedData) return cachedData.projects;

  const remote = await fetchFromGitHub();
  if (remote?.projects) {
    cachedData = remote;
    return remote.projects;
  }

  return localProjects;
}

export async function getSkills(): Promise<Skill[]> {
  if (cachedData) return cachedData.skills;

  const remote = await fetchFromGitHub();
  if (remote?.skills) {
    cachedData = remote;
    return remote.skills;
  }

  return localSkills;
}

export function getCachedData(): PortfolioData | null {
  return cachedData;
}
