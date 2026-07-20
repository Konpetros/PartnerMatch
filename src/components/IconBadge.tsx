import { LucideIcon } from 'lucide-react';

const COLOR_STYLES: Record<string, string> = {
  blue: 'bg-blue-100 text-blue-800',
  emerald: 'bg-emerald-100 text-emerald-800',
  green: 'bg-green-100 text-green-800',
  violet: 'bg-violet-100 text-violet-800',
  amber: 'bg-amber-100 text-amber-800',
  orange: 'bg-orange-50 text-orange-700 border border-orange-100',
};

interface IconBadgeProps {
  icon: LucideIcon;
  color: keyof typeof COLOR_STYLES;
  size?: 'xs' | 'sm';
  children: React.ReactNode;
}

export default function IconBadge({ icon: Icon, color, size = 'sm', children }: IconBadgeProps) {
  const textSize = size === 'xs' ? 'text-[9px]' : 'text-[10px]';
  return (
    <span className={`${textSize} font-bold px-2 py-1 rounded-md ${COLOR_STYLES[color]} flex items-center gap-1`}>
      <Icon className="w-3 h-3" /> {children}
    </span>
  );
}
