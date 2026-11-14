import {
  BarChart3,
  Bot,
  Camera,
  Code2,
  FileCode2,
  Globe,
  Languages,
  Megaphone,
  Mic,
  Palette as PaletteIcon,
  Smartphone,
  type LucideIcon,
} from 'lucide-react-native';

import type { SkillIcon } from '@/types';

export const SKILL_ICONS: Record<SkillIcon, LucideIcon> = {
  design: PaletteIcon,
  code: Code2,
  camera: Camera,
  growth: Megaphone,
  speaking: Mic,
  ai: Bot,
  data: BarChart3,
  languages: Languages,
  web: Globe,
  mobile: Smartphone,
  javascript: FileCode2,
};

type SkillIconViewProps = {
  name: SkillIcon;
  color: string;
  size?: number;
};

export function SkillIconView({ name, color, size = 14 }: SkillIconViewProps) {
  const Icon = SKILL_ICONS[name];
  return <Icon color={color} size={size} strokeWidth={2.2} />;
}
