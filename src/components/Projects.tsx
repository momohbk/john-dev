import { useState, useMemo } from 'react';
import { Filter } from 'lucide-react';
import { SectionWrapper, SectionHeading } from './SectionHeading';
import { ProjectCard } from './ProjectCard';
import { usePortfolioData } from '../hooks/usePortfolioData';
import { techOptions } from '../data/techOptions';

const allFilters = ['all', ...techOptions.map((t) => t.value)] as const;
const VISIBLE_FILTER_COUNT = 8;

export function Projects() {
  const { projects: projectsData, loading } = usePortfolioData();
  const [filter, setFilter] = useState('all');

  const filteredProjects = useMemo(
    () =>
      filter === 'all'
        ? projectsData
        : projectsData.filter((p) => p.techStack.includes(filter)),
    [projectsData, filter],
  );

  return (
    <SectionWrapper id="projects">
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading
          badge="Portfolio"
          title="Featured"
          highlighted="Projects"
          description="A curated selection of projects showcasing expertise in React, Laravel, and full-stack development"
        />

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            <div className="flex items-center justify-center gap-2 flex-wrap mb-12">
              <Filter className="w-4 h-4 text-slate-500" />
              {allFilters.slice(0, VISIBLE_FILTER_COUNT).map((tech) => (
                <button
                  key={tech}
                  onClick={() => setFilter(tech)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                    filter === tech
                      ? 'bg-primary text-white shadow-lg shadow-primary/30'
                      : 'bg-surface-light/50 text-slate-400 hover:text-white hover:bg-surface-lighter border border-white/5'
                  }`}
                >
                  {tech === 'all' ? 'All' : techOptions.find((t) => t.value === tech)?.label ?? tech}
                </button>
              ))}
            </div>

            {filteredProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project, index) => (
                  <ProjectCard key={project.id} project={project} index={index} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-slate-500 text-lg">No projects found for this filter.</p>
                <button
                  onClick={() => setFilter('all')}
                  className="mt-4 text-primary-light hover:text-primary transition-colors"
                >
                  Show all projects
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </SectionWrapper>
  );
}
