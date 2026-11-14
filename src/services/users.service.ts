import { api } from './api';
import type {
  PublicProfileDto,
  UserDto,
  ReviewDto,
  PagedResult,
  InterestDto,
  CommunityPostDto,
} from '@/types/api';

export const usersService = {
  getProfile: (id: string) => api.get<PublicProfileDto>(`/api/users/${id}`),

  follow: (id: string) => api.post<void>(`/api/users/${id}/follow`),
  unfollow: (id: string) => api.delete<void>(`/api/users/${id}/follow`),

  updateProfile: (
    name: string,
    bio?: string,
    location?: string,
    timeZone?: string,
    avatarUrl?: string
  ) => api.put<UserDto>('/api/users/me', { name, bio, location, timeZone, avatarUrl }),

  getReviews: (userId: string, page = 1, pageSize = 20) =>
    api.get<PagedResult<ReviewDto>>(
      `/api/users/${userId}/reviews?page=${page}&pageSize=${pageSize}`
    ),

  getInterests: () => api.get<InterestDto[]>('/api/users/me/interests'),

  getPosts: (userId: string, pageSize = 20) =>
    api.get<PagedResult<CommunityPostDto>>(
      `/api/posts?authorId=${userId}&page=1&pageSize=${pageSize}`
    ),

  completeOnboarding: (interestSkillIds: number[], offeringSkillIds?: number[]) =>
    api.post<void>('/api/users/me/onboarding', {
      interestSkillIds,
      offeringSkillIds: offeringSkillIds ?? [],
    }),
};
