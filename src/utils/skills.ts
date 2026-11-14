import type { SkillIcon } from '@/types';

const ICON_RULES: Array<{ match: RegExp; icon: SkillIcon }> = [
  { match: /photo|camera|video/i, icon: 'camera' },
  { match: /guitar|piano|sing|music|dance/i, icon: 'languages' },
  { match: /french|spanish|yoruba|igbo|english|language/i, icon: 'languages' },
  { match: /market|copywrit|sales|business|project|bookkeep/i, icon: 'growth' },
  { match: /speak|presentation|writing/i, icon: 'speaking' },
  { match: /data|excel|sql|power bi|python|analysis/i, icon: 'data' },
  { match: /mobile|react native|android|ios/i, icon: 'mobile' },
  { match: /javascript|typescript|c#|java|code|program/i, icon: 'code' },
  { match: /web|react|frontend|backend|full.?stack/i, icon: 'web' },
  { match: /design|figma|illustrat|photoshop|ux|ui|creative/i, icon: 'design' },
  { match: /fitness|cook|bak|fashion|tailor|makeup|lifestyle/i, icon: 'growth' },
];

export function iconForSkill(name: string, category?: string): SkillIcon {
  const value = `${name} ${category ?? ''}`;
  return ICON_RULES.find((rule) => rule.match.test(value))?.icon ?? 'ai';
}

export function handleForName(name: string): string {
  const handle = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '')
    .slice(0, 20);
  return `@${handle || 'member'}`;
}

export function initialsForName(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}
