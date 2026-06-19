import { skillsData } from '../data/projectsData';

const Skills = () => {
  const categories = ['Frontend', 'Backend', 'Database', 'DevOps', 'Tools'];

  return (
    <section id="skills" className="py-24 relative">
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-4">
            Technical Expertise
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Skills & <span className="bg-gradient-to-r from-primary-light to-accent bg-clip-text text-transparent">Technologies</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Two decades of mastery across the full stack — from frontend to infrastructure
          </p>
        </div>

        {categories.map((category) => (
          <div key={category} className="mb-12 last:mb-0">
            <h3 className="text-lg font-semibold text-slate-300 mb-6 flex items-center gap-2">
              <span className="w-1 h-6 rounded-full bg-gradient-to-b from-primary to-accent" />
              {category}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {skillsData
                .filter((skill) => skill.category === category)
                .map((skill) => (
                  <div
                    key={skill.name}
                    className="group relative p-5 rounded-2xl bg-surface-light/50 border border-white/5 hover:border-primary/30 backdrop-blur-sm transition-all duration-500 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{skill.icon}</span>
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
        ))}
      </div>
    </section>
  );
};

export default Skills;
