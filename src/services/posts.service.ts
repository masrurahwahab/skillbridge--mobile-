import { api } from './api';
import type { CommunityPostDto, PagedResult } from '@/types/api';

type PostFilters = {
  category?: string;
  authorId?: string;
  query?: string;
  page?: number;
  pageSize?: number;
};

export const postsService = {
  list: ({ category, authorId, query, page = 1, pageSize = 20 }: PostFilters = {}) => {
    const params = new URLSearchParams();
    if (category && category !== 'all') params.set('category', category);
    if (authorId) params.set('authorId', authorId);
    if (query) params.set('query', query);
    params.set('page', String(page));
    params.set('pageSize', String(pageSize));
    return api.get<PagedResult<CommunityPostDto>>(`/api/posts?${params.toString()}`);
  },

  create: (category: string, content: string, imageUrl?: string) =>
    api.post<CommunityPostDto>('/api/posts', { category, content, imageUrl }),

  toggleLike: (id: string) => api.post<void>(`/api/posts/${id}/like`),
};
