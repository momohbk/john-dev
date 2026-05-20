import { useMemo } from 'react';
import { SectionWrapper, SectionHeading } from './SectionHeading';
import { skillCategories } from '../data/skillsData';
import { usePortfolioData } from '../hooks/usePortfolioData';
import type { SkillCategory } from '../types';

export function Skills() {
  const { skills: skillsData, loading } = usePortfolioData();

  const categorySkills = useMemo(
    () =>
      skillCategories.reduce(
        (acc, cat) => {
          acc[cat] = skillsData.filter((s) => s.category === cat);
          return acc;
        },
        {} as Record<SkillCategory, typeof skillsData>,
      ),
    [skillsData],
  );

  return (
    <SectionWrapper id="skills">
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading
          badge="Technical Expertise"
          title="Skills &"
          highlighted="Technologies"
          description="Full-stack development expertise — from frontend to infrastructure"
          badgeColor="accent"
        />

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : skillCategories.map((category) => {
          const skills = categorySkills[category];
          if (!skills || skills.length === 0) return null;

          return (
            <div key={category} className="mb-12 last:mb-0">
              <h3 className="text-lg font-semibold text-slate-300 mb-6 flex items-center gap-2">
                <span className="w-1 h-6 rounded-full bg-gradient-to-b from-primary to-accent" />
                {category}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {skills.map((skill) => (
                  <div
                    key={skill.name}
                    className="group relative p-5 rounded-2xl bg-surface-light/50 border border-white/5 hover:border-primary/30 backdrop-blur-sm transition-all duration-500 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl" role="img" aria-label={skill.name}>
                          {skill.icon}
                        </span>
                        <span className="font-semibold text-white group-hover:text-primary-light transition-colors">
                          {skill.name}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-accent">{skill.level}%</span>
                    </div>
                    <div className="w-full h-2 bg-surface-lighter rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-1000 ease-out group-hover:shadow-[0_0_12px_rgba(99,102,241,0.5)]"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </SectionWrapper>
  );
}
