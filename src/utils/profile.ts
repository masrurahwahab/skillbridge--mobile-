import type { ProfileReview, UserProfile } from '@/types';
import type {
  CommunityPostDto,
  PagedResult,
  PublicProfileDto,
  ReviewDto,
} from '@/types/api';
import { handleForName, iconForSkill } from '@/utils/skills';
import { formatRelativeTime } from '@/utils/time';

export function buildUserProfile(
  profile: PublicProfileDto,
  posts: PagedResult<CommunityPostDto>,
  reviews: PagedResult<ReviewDto>
): UserProfile {
  const user = profile.user;
  const profileReviews: ProfileReview[] = reviews.items.map((review) => ({
    id: review.id,
    reviewerName: review.reviewer.name,
    reviewerAvatarUrl: review.reviewer.avatarUrl ?? '',
    rating: review.rating,
    comment: review.comment ?? 'Great exchange partner.',
    timeAgo: formatRelativeTime(review.createdAt),
  }));

  return {
    name: user.name,
    handle: handleForName(user.name),
    avatarUrl: user.avatarUrl ?? '',
    badge: profile.offering.length > 0 ? 'Skill teacher' : 'Community member',
    role: user.bio ? 'Exchange partner' : 'Learner',
    location: user.location || user.timeZone || 'Remote',
    bio: user.bio || 'This member has not added a bio yet.',
    stats: [
      { id: 'rating', label: 'Partner rating', value: user.averageRating.toFixed(1), tone: 'success' },
      { id: 'reviews', label: 'Reviews', value: String(user.reviewCount), tone: 'primary' },
      { id: 'swaps', label: 'Swaps', value: String(user.completedSwaps), tone: 'primary' },
    ],
    teachSkills: profile.offering.map((userSkill) => ({
      id: String(userSkill.skill.id),
      label: userSkill.skill.name,
      icon: iconForSkill(userSkill.skill.name, userSkill.skill.category),
    })),
    learnSkills: profile.wanted.map((userSkill) => ({
      id: String(userSkill.skill.id),
      label: userSkill.skill.name,
      icon: iconForSkill(userSkill.skill.name, userSkill.skill.category),
    })),
    posts: posts.items.map((post) => ({
      id: post.id,
      pinned: false,
      kicker: post.category,
      title: post.content.split('\n')[0].slice(0, 64),
      body: post.content,
      likes: post.likesCount,
      comments: post.commentsCount,
    })),
    postCount: posts.total,
    exchangeCount: user.completedSwaps,
    reviews: profileReviews,
  };
}
