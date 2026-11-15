import type { CommunityPostExtended, PostCategory } from '@/types';
import type { CommunityPostDto } from '@/types/api';
import { handleForName } from '@/utils/skills';
import { formatRelativeTime } from '@/utils/time';

const CATEGORY_VALUES: PostCategory[] = [
  'discussion',
  'question',
  'project',
  'tutorial',
  'opportunity',
];

export function toPostCategory(value: string): PostCategory {
  const normalized = value.toLowerCase();
  return CATEGORY_VALUES.find((category) => category === normalized) ?? 'discussion';
}

export function toCommunityPost(dto: CommunityPostDto): CommunityPostExtended {
  return {
    id: dto.id,
    author: {
      name: dto.author.name,
      handle: handleForName(dto.author.name),
      role: dto.author.location ?? 'Member',
      avatarUrl: dto.author.avatarUrl ?? '',
    },
    timeAgo: formatRelativeTime(dto.createdAt),
    category: dto.category,
    postCategory: toPostCategory(dto.category),
    skillExchange: dto.category,
    content: dto.content,
    imageUrl: dto.imageUrl,
    likes: dto.likesCount,
    comments: dto.commentsCount,
    actionLabel: 'Open thread',
    trending: dto.likesCount >= 20,
    following: false,
    isLiked: dto.isLikedByMe,
    saved: false,
  };
}
