import type { PostCategory, SettingsItem, SettingsSection } from '@/types';

export const categoryFilters: Array<{ id: PostCategory; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'discussion', label: 'Discussions' },
  { id: 'question', label: 'Questions' },
  { id: 'project', label: 'Projects' },
  { id: 'tutorial', label: 'Tutorials' },
  { id: 'opportunity', label: 'Opportunities' },
];

export const reviewTags = [
  'Clear explanations',
  'Great communicator',
  'Well prepared',
  'Generous with feedback',
  'On time',
];

export const popularSearches: Array<{ id: string; label: string }> = [
  { id: 'ui-design', label: '#UIDesign' },
  { id: 'react-native', label: '#ReactNative' },
  { id: 'public-speaking', label: '#PublicSpeaking' },
  { id: 'data-analysis', label: '#DataAnalysis' },
  { id: 'photography', label: '#Photography' },
];

export const onboardingStep = { current: 2, total: 3 } as const;

export const notificationFilters: Array<{
  id: 'all' | 'swaps' | 'community';
  label: string;
}> = [
  { id: 'all', label: 'All' },
  { id: 'swaps', label: 'Swaps & Invites' },
  { id: 'community', label: 'Community' },
];

export const settingsSections: SettingsSection[] = [
  {
    id: 'account',
    title: 'Account & Profile',
    items: [
      {
        id: 'edit-profile',
        title: 'Edit Profile',
        description: 'Bio, photo, and title',
        icon: 'profile',
        kind: 'link',
        action: 'edit-profile',
        tone: 'accent',
      },
      {
        id: 'manage-skills',
        title: 'Manage Interests & Skills',
        description: 'Update skills you teach & learn',
        icon: 'skills',
        kind: 'link',
        action: 'manage-skills',
        tone: 'learn',
      },
      {
        id: 'share-profile',
        title: 'Share Profile & QR',
        description: 'Custom link and badge',
        icon: 'share',
        kind: 'link',
        action: 'share-profile',
        tone: 'accent',
      },
    ],
  },
  {
    id: 'preferences',
    title: 'Preferences & Matchmaking',
    items: [
      {
        id: 'matching',
        title: 'Skill Matching Engine',
        description: 'Show me in reciprocal partner search',
        icon: 'matching',
        kind: 'toggle',
        enabled: true,
        tone: 'success',
      },
      {
        id: 'notification-preferences',
        title: 'Notification Preferences',
        description: 'Swap invites, chat, and sessions',
        icon: 'notifications',
        kind: 'link',
        action: 'notifications',
        tone: 'warning',
      },
      {
        id: 'privacy',
        title: 'Privacy & Security',
        description: 'Video permissions and data controls',
        icon: 'privacy',
        kind: 'link',
        action: 'privacy',
        tone: 'neutral',
      },
    ],
  },
];

export const logoutSettingsItem: SettingsItem = {
  id: 'logout',
  title: 'Log Out of SkillBridge',
  description: 'Sign out of this device',
  icon: 'logout',
  kind: 'link',
  action: 'logout',
  tone: 'danger',
};

export const settingsVersionLabel = 'SkillBridge Mobile v1.0.4';
