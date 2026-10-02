import {
  Atom,
  Cloud,
  Database,
  Globe,
  Monitor,
  Server,
  Smartphone,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';

const icons: Record<string, LucideIcon> = {
  Globe,
  Smartphone,
  Monitor,
  Sparkles,
  Atom,
  Server,
  Database,
  Cloud,
};

interface DynamicIconProps {
  name?: string;
  size?: number;
  className?: string;
  strokeWidth?: number;
}

export function DynamicIcon({ name, size = 20, className, strokeWidth = 1.75 }: DynamicIconProps) {
  const Icon = (name && icons[name]) || Sparkles;
  return <Icon size={size} className={className} strokeWidth={strokeWidth} aria-hidden />;
}
