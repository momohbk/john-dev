import type { ReactNode } from 'react';

interface SectionHeadingProps {
  badge: string;
  title: string;
  highlighted: string;
  description: string;
  badgeColor?: 'primary' | 'accent';
}

const colorMap = {
  primary: {
    bg: 'bg-primary/10',
    border: 'border-primary/20',
    text: 'text-primary-light',
  },
  accent: {
    bg: 'bg-accent/10',
    border: 'border-accent/20',
    text: 'text-accent',
  },
} as const;

export function SectionHeading({ badge, title, highlighted, description, badgeColor = 'primary' }: SectionHeadingProps) {
  const colors = colorMap[badgeColor];

  return (
    <div className="text-center mb-16">
      <span className={`inline-block px-4 py-1.5 rounded-full ${colors.bg} ${colors.border} border ${colors.text} text-sm font-medium mb-4`}>
        {badge}
      </span>
      <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
        {title}{' '}
        <span className="bg-gradient-to-r from-primary-light to-accent bg-clip-text text-transparent">
          {highlighted}
        </span>
      </h2>
      <p className="text-slate-400 max-w-2xl mx-auto">
        {description}
      </p>
    </div>
  );
}

interface SectionWrapperProps {
  id: string;
  children: ReactNode;
  className?: string;
}

export function SectionWrapper({ id, children, className = '' }: SectionWrapperProps) {
  return (
    <section id={id} className={`py-24 relative ${className}`}>
      {children}
    </section>
  );
}
