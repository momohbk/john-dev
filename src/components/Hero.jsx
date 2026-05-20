import { ArrowDown, ExternalLink, Sparkles, Code } from 'lucide-react';

const Hero = ({ onNavigate }) => {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-fade-in-up">
          <Sparkles className="w-4 h-4 text-primary-light" />
          <span className="text-sm text-primary-light font-medium">Senior Full-Stack Developer — 20+ Years Experience</span>
        </div>

        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <span className="text-white">Hi, I'm</span>
          <br />
          <span className="bg-gradient-to-r from-primary via-primary-light to-accent bg-clip-text text-transparent animate-gradient">
            John
          </span>
        </h1>

        <p className="text-xl sm:text-2xl text-slate-400 max-w-3xl mx-auto mb-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          Senior Full-Stack Architect
        </p>

        <p className="text-base sm:text-lg text-slate-500 max-w-2xl mx-auto mb-12 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          Over two decades crafting enterprise-grade web applications. I architect scalable systems,
          lead engineering teams, and deliver solutions that power businesses globally.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <button
            onClick={() => onNavigate('projects')}
            className="group px-8 py-4 rounded-2xl bg-gradient-to-r from-primary to-primary-dark text-white font-semibold text-lg hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300 hover:scale-105 flex items-center gap-3"
          >
            View My Work
            <ExternalLink className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={() => onNavigate('contact')}
            className="group px-8 py-4 rounded-2xl border border-white/20 text-white font-semibold text-lg hover:bg-white/10 hover:border-white/30 transition-all duration-300 flex items-center gap-3"
          >
            <Code className="w-5 h-5 text-accent" />
            Let's Talk
          </button>
        </div>

        <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
          {[
            { number: '80+', label: 'Projects Delivered' },
            { number: '50+', label: 'Happy Clients' },
            { number: '20+', label: 'Years Experience' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary-light to-accent bg-clip-text text-transparent">
                {stat.number}
              </div>
              <div className="text-xs sm:text-sm text-slate-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        <button
          onClick={() => onNavigate('skills')}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-slate-500 hover:text-primary-light transition-colors"
          aria-label="Scroll to skills"
        >
          <ArrowDown className="w-6 h-6" />
        </button>
      </div>
    </section>
  );
};

export default Hero;
