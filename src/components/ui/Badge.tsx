import { cn } from '@/lib/utils/cn';

type BadgeColor = 'indigo' | 'green' | 'yellow' | 'red' | 'cyan' | 'gray';

interface BadgeProps {
  color?: BadgeColor;
  children: React.ReactNode;
  className?: string;
}

const colors: Record<BadgeColor, string> = {
  indigo: 'bg-indigo-100 text-indigo-700',
  green:  'bg-emerald-100 text-emerald-700',
  yellow: 'bg-amber-100 text-amber-700',
  red:    'bg-red-100 text-red-700',
  cyan:   'bg-cyan-100 text-cyan-700',
  gray:   'bg-gray-100 text-gray-600',
};

export function Badge({ color = 'indigo', children, className }: BadgeProps) {
  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', colors[color], className)}>
      {children}
    </span>
  );
}
