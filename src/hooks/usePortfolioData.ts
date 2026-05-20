import { useState, useEffect } from 'react';
import type { Project, Skill } from '../types';
import { getProjects, getSkills } from '../services/portfolioApi';
import { projectsData as fallbackProjects } from '../data/projectsData';
import { skillsData as fallbackSkills } from '../data/skillsData';

interface PortfolioState {
  projects: Project[];
  skills: Skill[];
  loading: boolean;
  error: string | null;
}

export function usePortfolioData(): PortfolioState {
  const [state, setState] = useState<PortfolioState>({
    projects: fallbackProjects,
    skills: fallbackSkills,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [projects, skills] = await Promise.all([
          getProjects(),
          getSkills(),
        ]);

        if (!cancelled) {
          setState({ projects, skills, loading: false, error: null });
        }
      } catch {
        if (!cancelled) {
          setState({
            projects: fallbackProjects,
            skills: fallbackSkills,
            loading: false,
            error: 'Failed to fetch from GitHub. Using local data.',
          });
        }
      }
    }

    load();

    return () => { cancelled = true; };
  }, []);

  return state;
}
