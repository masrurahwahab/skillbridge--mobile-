export type SkillIcon =
  | 'design'
  | 'code'
  | 'camera'
  | 'growth'
  | 'speaking'
  | 'ai'
  | 'data'
  | 'languages'
  | 'web'
  | 'mobile'
  | 'javascript';

export type FeedTab = 'for-you' | 'trending' | 'following';

export type PostCategory =
  | 'all'
  | 'discussion'
  | 'question'
  | 'project'
  | 'tutorial'
  | 'opportunity';

export type Interest = {
  id: string;
  label: string;
  icon: SkillIcon;
  selected: boolean;
};

export type CurrentUser = {
  name: string;
  handle: string;
  avatarUrl: string;
};

export type Person = {
  id: string;
  name: string;
  handle: string;
  avatarUrl: string;
  matchPercent: number;
  teaches: string;
  wants: string;
  teachesIcon: SkillIcon;
  wantsIcon: SkillIcon;
  badge?: string;
  badgeTone?: 'success' | 'teach';
};

export type TrendingSkill = {
  id: string;
  rank: string;
  title: string;
  meta: string;
  tone: 'accent' | 'success' | 'primary' | 'warning';
};

export type PostAuthor = {
  name: string;
  handle: string;
  role: string;
  avatarUrl: string;
};

export type CommunityPost = {
  id: string;
  author: PostAuthor;
  timeAgo: string;
  category: string;
  content: string;
  imageUrl?: string;
  likes: number;
  comments: number;
  actionLabel: string;
  trending: boolean;
  following: boolean;
  isLiked?: boolean;
};

export type CommunityPostExtended = CommunityPost & {
  postCategory: PostCategory;
  skillExchange?: string;
  saved?: boolean;
};

export type SearchSkill = {
  id: string;
  label: string;
  icon: SkillIcon;
  emphasis: 'primary' | 'teach' | 'neutral';
  detailId?: string;
};

export type RecentSearch = {
  id: string;
  label: string;
};

export type CommunityTopic = {
  id: string;
  label: string;
};

export type SearchDiscussion = {
  id: string;
  author: PostAuthor;
  category: string;
  timeAgo: string;
  question: string;
  answers: number;
  peerSessions: number;
};

export type MatchInsightTone = 'warm' | 'neutral';

export type SkillMatch = {
  id: string;
  name: string;
  avatarUrl: string;
  verified: boolean;
  role: string;
  location: string;
  matchPercent: number;
  matchLabel: string;
  topPick: boolean;
  activity: string;
  rating: number;
  exchangeCount: number;
  completionRate?: number;
  teaches: string;
  wants: string;
  teachesIcon: SkillIcon;
  wantsIcon: SkillIcon;
  insight: string;
  insightTone: MatchInsightTone;
};

export type SkillOption = {
  id: string;
  label: string;
  icon: SkillIcon;
};

export type ProfileStat = {
  id: string;
  label: string;
  value: string;
  tone: 'primary' | 'success';
};

export type ProfilePost = {
  id: string;
  pinned: boolean;
  kicker: string;
  title: string;
  body: string;
  likes: number;
  comments: number;
};

export type ProfileReview = {
  id: string;
  reviewerName: string;
  reviewerAvatarUrl: string;
  rating: number;
  comment: string;
  timeAgo: string;
};

export type ProfileTabKey = 'posts' | 'exchanges' | 'reviews';

export type UserProfile = CurrentUser & {
  badge: string;
  role: string;
  location: string;
  bio: string;
  stats: ProfileStat[];
  teachSkills: SkillOption[];
  learnSkills: SkillOption[];
  posts: ProfilePost[];
  postCount: number;
  exchangeCount: number;
  reviews?: ProfileReview[];
};

export type OnboardingSkillOption = SkillOption & {
  selected: boolean;
};

export type SkillTeacher = {
  id: string;
  name: string;
  avatarUrl: string;
  role: string;
  rating: number;
  sessions: number;
  matchPercent?: number;
};

export type SkillLearner = {
  id: string;
  name: string;
  avatarUrl: string;
  role: string;
  goal: string;
  availability: string;
};

export type RelatedSkill = SkillOption & {
  detailId?: string;
};

export type SkillDetail = {
  id: string;
  title: string;
  category: string;
  icon: SkillIcon;
  demandLabel: string;
  description: string;
  teachesCount: number;
  learnersCount: number;
  highlights: string[];
  relatedSkills: RelatedSkill[];
  teachers: SkillTeacher[];
  learners: SkillLearner[];
  discussion?: SearchDiscussion;
};

export type SwapMessageSender = 'me' | 'partner' | 'system';

export type SwapSession = {
  title: string;
  dateLabel: string;
  timeLabel: string;
  durationLabel: string;
  formatLabel: string;
  status: 'scheduled' | 'completed';
};

export type SwapMessage = {
  id: string;
  sender: SwapMessageSender;
  text?: string;
  timeLabel?: string;
  session?: SwapSession;
};

export type SwapWorkspace = {
  id: string;
  partner: {
    name: string;
    avatarUrl: string;
    role: string;
    activity: string;
    matchPercent: number;
  };
  agreement: {
    yourSkill: string;
    yourSkillIcon: SkillIcon;
    partnerSkill: string;
    partnerSkillIcon: SkillIcon;
  };
  session: SwapSession;
  messages: SwapMessage[];
};

export type ImpactMetric = {
  id: string;
  label: string;
  value: string;
  caption: string;
};

export type ImpactSummary = {
  eyebrow: string;
  title: string;
  description: string;
  metrics: ImpactMetric[];
};

export type Endorsement = {
  id: string;
  author: PostAuthor;
  skill: string;
  quote: string;
  rating: number;
  timeAgo: string;
};

export type NotificationKind = 'swap' | 'session' | 'endorsement' | 'community';

export type NotificationFilterKey = 'all' | 'swaps' | 'community';

export type AppNotification = {
  id: string;
  kind: NotificationKind;
  category: Exclude<NotificationFilterKey, 'all'>;
  title: string;
  timeAgo: string;
  bodyPrefix: string;
  highlight?: string;
  bodySuffix?: string;
  unread: boolean;
  avatarName: string;
    avatarUrl?: string;
    initials?: string;
    swapId?: string;
  };

export type SettingsIcon =
  | 'profile'
  | 'skills'
  | 'share'
  | 'matching'
  | 'notifications'
  | 'privacy'
  | 'logout';

export type SettingsAction =
  | 'edit-profile'
  | 'manage-skills'
  | 'share-profile'
  | 'notifications'
  | 'privacy'
  | 'logout';

export type SettingsItem = {
  id: string;
  title: string;
  description: string;
  icon: SettingsIcon;
  kind: 'link' | 'toggle';
  action?: SettingsAction;
  enabled?: boolean;
  tone?: 'accent' | 'success' | 'warning' | 'learn' | 'neutral' | 'danger';
};

export type SettingsSection = {
  id: string;
  title: string;
  items: SettingsItem[];
};
