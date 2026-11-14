// Enums mirror the backend JSON (enums serialize as strings).
export type SkillType = 'Offering' | 'Wanted';
export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type MatchKind = 'Mutual' | 'Partial' | 'Chain';
export type SwapStatus = 'Proposed' | 'Active' | 'Completed' | 'Declined' | 'Cancelled';
export type SessionStatus = 'Scheduled' | 'Done' | 'Cancelled';
export type EventType = 'Search' | 'ViewProfile' | 'AddWanted' | 'ProposeSwap' | 'CompleteSwap';
export type ShelfType = 'People' | 'Skills';
export type NotificationType =
  | 'SwapProposed'
  | 'SwapAccepted'
  | 'SwapDeclined'
  | 'SwapCompleted'
  | 'NewMessage'
  | 'SessionScheduled'
  | 'SessionChanged'
  | 'ReviewReceived';

export interface PagedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
}

export interface SkillDto {
  id: number;
  name: string;
  category: string;
}

export interface UserDto {
  id: string;
  name: string;
  bio?: string;
  location?: string;
  timeZone?: string;
  avatarUrl?: string;
  averageRating: number;
  reviewCount: number;
  completedSwaps: number;
  joinedAt: string;
}

export interface UserSkillDto {
  id: number;
  skill: SkillDto;
  type: SkillType;
  level: SkillLevel;
  notes?: string;
}

export interface MySkillsDto {
  offering: UserSkillDto[];
  wanted: UserSkillDto[];
}

export interface AuthResponse {
  token: string;
  expiresAt: string;
  user: UserDto;
}

export interface PublicProfileDto {
  user: UserDto;
  offering: UserSkillDto[];
  wanted: UserSkillDto[];
  isFollowing: boolean;
}

export interface MatchDto {
  user: UserDto;
  kind: MatchKind;
  score: number;
  theyCanTeachMe: SkillDto[];
  iCanTeachThem: SkillDto[];
}

export interface ChainLinkDto {
  teacher: UserDto;
  learner: UserDto;
  skill: SkillDto;
}

export interface ChainMatchDto {
  links: ChainLinkDto[];
  score: number;
}

export interface TrackEventRequest {
  type: EventType;
  skillId?: number;
  targetUserId?: string;
  query?: string;
}

export interface DiscoverItemDto {
  user?: UserDto;
  skill?: SkillDto;
  badge?: string;
  reason?: string;
  score?: number;
}

export interface ShelfDto {
  id: string;
  title: string;
  reason?: string;
  type: ShelfType;
  items: DiscoverItemDto[];
}

export interface InterestDto {
  skill: SkillDto;
  score: number;
}

export interface DiscoverDto {
  shelves: ShelfDto[];
  topInterests: InterestDto[];
}

export interface SwapDto {
  id: string;
  proposer: UserDto;
  receiver: UserDto;
  proposerTeaches: SkillDto;
  receiverTeaches: SkillDto;
  hoursEach: number;
  message?: string;
  status: SwapStatus;
  proposerCompleted: boolean;
  receiverCompleted: boolean;
  unreadMessages: number;
  createdAt: string;
  acceptedAt?: string;
  completedAt?: string;
}

export interface MessageDto {
  id: number;
  swapId: string;
  senderId: string;
  text: string;
  sentAt: string;
}

export interface SessionDto {
  id: string;
  swapId: string;
  teacher: UserDto;
  skill: SkillDto;
  scheduledAt: string;
  durationMinutes: number;
  status: SessionStatus;
  meetingLink?: string;
  notes?: string;
}

export interface ReviewDto {
  id: string;
  swapId: string;
  reviewer: UserDto;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface NotificationDto {
  id: number;
  type: NotificationType;
  text: string;
  swapId?: string;
  isRead: boolean;
  createdAt: string;
}

export interface ImpactStatsDto {
  totalUsers: number;
  activeSwaps: number;
  completedSwaps: number;
  hoursExchanged: number;
  estimatedMoneySaved: number;
  currency: string;
  topSkills: Array<{ skill: string; count: number }>;
}

export interface CommunityPostDto {
  id: string;
  author: UserDto;
  category: string;
  content: string;
  imageUrl?: string;
  likesCount: number;
  commentsCount: number;
  isLikedByMe: boolean;
  createdAt: string;
}

export interface PostCommentDto {
  id: string;
  postId: string;
  author: UserDto;
  content: string;
  createdAt: string;
}

export interface SkillDetailDto {
  skill: SkillDto;
  teachersCount: number;
  learnersCount: number;
  wantedCount: number;
  teachers: UserDto[];
  learners: UserDto[];
  relatedSkills: SkillDto[];
  discussion?: CommunityPostDto;
}

export interface SearchResultDto {
  query: string;
  skills: SkillDto[];
  people: MatchDto[];
  posts: CommunityPostDto[];
}
