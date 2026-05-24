import { getTechInfo } from '../data/techOptions';

interface TechBadgeProps {
  tech: string;
}

export function TechBadge({ tech }: TechBadgeProps) {
  const { label, color } = getTechInfo(tech);

  return (
    <span
      className="px-3 py-1 rounded-full text-xs font-medium border transition-all duration-300 hover:scale-105"
      style={{
        backgroundColor: `${color}15`,
        borderColor: `${color}30`,
        color,
      }}
    >
      {label}
    </span>
  );
}
