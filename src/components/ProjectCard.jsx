import { ExternalLink, Star } from 'lucide-react';

const GithubIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
);
import { techOptions } from '../data/projectsData';

const ProjectCard = ({ project, index }) => {
  const getTechInfo = (techValue) => {
    return techOptions.find((t) => t.value === techValue) || { label: techValue, color: '#6366f1' };
  };

  return (
    <div
      className={`group relative rounded-2xl overflow-hidden bg-surface-light/50 border border-white/5 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2 animate-fade-in-up`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {project.featured && (
        <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-primary/90 to-accent/90 backdrop-blur-sm">
          <Star className="w-3.5 h-3.5 text-white fill-white" />
          <span className="text-xs font-semibold text-white">Featured</span>
        </div>
      )}

      <div className="relative h-52 overflow-hidden">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-light via-surface-light/50 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />

        <div className="absolute bottom-4 left-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium hover:bg-white/20 transition-all"
            >
              <ExternalLink className="w-4 h-4" />
              Live Demo
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium hover:bg-white/20 transition-all"
            >
              <GithubIcon />
              Code
            </a>
          )}
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary-light transition-colors">
          {project.title}
        </h3>
        <p className="text-slate-400 text-sm leading-relaxed mb-4 line-clamp-3">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-2">
          {project.techStack.map((tech) => {
            const techInfo = getTechInfo(tech);
            return (
              <span
                key={tech}
                className="px-3 py-1 rounded-full text-xs font-medium border transition-all duration-300 hover:scale-105"
                style={{
                  backgroundColor: `${techInfo.color}15`,
                  borderColor: `${techInfo.color}30`,
                  color: techInfo.color,
                }}
              >
                {techInfo.label}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
