import { api } from './api';
import type { CommunityPostDto, PagedResult, PostCommentDto } from '@/types/api';

type PostFilters = {
  category?: string;
  authorId?: string;
  query?: string;
  following?: boolean;
  page?: number;
  pageSize?: number;
};

export const postsService = {
  list: ({ category, authorId, query, following, page = 1, pageSize = 20 }: PostFilters = {}) => {
    const params = new URLSearchParams();
    if (category && category !== 'all') params.set('category', category);
    if (authorId) params.set('authorId', authorId);
    if (query) params.set('query', query);
    if (following) params.set('following', 'true');
    params.set('page', String(page));
    params.set('pageSize', String(pageSize));
    return api.get<PagedResult<CommunityPostDto>>(`/api/posts?${params.toString()}`);
  },

  get: (id: string) => api.get<CommunityPostDto>(`/api/posts/${id}`),

  listComments: (id: string, page = 1, pageSize = 30) =>
    api.get<PagedResult<PostCommentDto>>(
      `/api/posts/${id}/comments?page=${page}&pageSize=${pageSize}`
    ),

  addComment: (id: string, content: string) =>
    api.post<PostCommentDto>(`/api/posts/${id}/comments`, { content }),

  create: (category: string, content: string, imageUrl?: string) =>
    api.post<CommunityPostDto>('/api/posts', { category, content, imageUrl }),

  toggleLike: (id: string) => api.post<void>(`/api/posts/${id}/like`),
};
