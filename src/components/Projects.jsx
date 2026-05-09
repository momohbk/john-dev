import { useState } from 'react';
import ProjectCard from './ProjectCard';
import { projectsData } from '../data/projectsData';
import { Filter } from 'lucide-react';
import { techOptions } from '../data/projectsData';

const Projects = () => {
  const [filter, setFilter] = useState('all');

  const allTech = ['all', ...techOptions.map((t) => t.value)];

  const filteredProjects =
    filter === 'all'
      ? projectsData
      : projectsData.filter((p) => p.techStack.includes(filter));

  return (
    <section id="projects" className="py-24 relative">
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary-light text-sm font-medium mb-4">
            Portfolio
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Featured <span className="bg-gradient-to-r from-primary-light to-accent bg-clip-text text-transparent">Projects</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            A curated selection of projects showcasing expertise in React, Laravel, and full-stack development
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 flex-wrap mb-12">
          <Filter className="w-4 h-4 text-slate-500" />
          {allTech.slice(0, 8).map((tech) => (
            <button
              key={tech}
              onClick={() => setFilter(tech)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                filter === tech
                  ? 'bg-primary text-white shadow-lg shadow-primary/30'
                  : 'bg-surface-light/50 text-slate-400 hover:text-white hover:bg-surface-lighter border border-white/5'
              }`}
            >
              {tech === 'all' ? 'All' : techOptions.find((t) => t.value === tech)?.label || tech}
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
      </div>
    </section>
  );
};

export default Projects;
