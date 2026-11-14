import { api } from './api';
import type {
  SwapDto,
  PagedResult,
  MessageDto,
  SessionDto,
  ReviewDto,
} from '@/types/api';

export const swapsService = {
  list: (status?: string, page = 1, pageSize = 20) =>
    api.get<PagedResult<SwapDto>>(
      `/api/swaps?${status ? `status=${status}&` : ''}page=${page}&pageSize=${pageSize}`
    ),

  get: (id: string) => api.get<SwapDto>(`/api/swaps/${id}`),

  propose: (
    partnerId: string,
    skillIWillTeachId: number,
    skillIWillLearnId: number,
    hoursEach: number,
    message?: string
  ) =>
    api.post<SwapDto>('/api/swaps', {
      partnerId,
      skillIWillTeachId,
      skillIWillLearnId,
      hoursEach,
      message,
    }),

  accept: (id: string) => api.post<SwapDto>(`/api/swaps/${id}/accept`),
  decline: (id: string) => api.post<SwapDto>(`/api/swaps/${id}/decline`),
  cancel: (id: string) => api.post<SwapDto>(`/api/swaps/${id}/cancel`),
  complete: (id: string) => api.post<SwapDto>(`/api/swaps/${id}/complete`),

  // Messages
  getMessages: (swapId: string, limit = 50, before?: string) =>
    api.get<MessageDto[]>(
      `/api/swaps/${swapId}/messages?limit=${limit}${before ? `&before=${encodeURIComponent(before)}` : ''}`
    ),

  sendMessage: (swapId: string, text: string) =>
    api.post<MessageDto>(`/api/swaps/${swapId}/messages`, { text }),

  // Sessions
  getSessions: (swapId: string) =>
    api.get<SessionDto[]>(`/api/swaps/${swapId}/sessions`),

  createSession: (
    swapId: string,
    teacherId: string,
    skillId: number,
    scheduledAt: string,
    durationMinutes: number,
    meetingLink?: string
  ) =>
    api.post<SessionDto>(`/api/swaps/${swapId}/sessions`, {
      teacherId,
      skillId,
      scheduledAt,
      durationMinutes,
      meetingLink,
    }),

  updateSession: (
    id: string,
    scheduledAt?: string,
    status?: string,
    notes?: string,
    meetingLink?: string
  ) =>
    api.patch<SessionDto>(`/api/sessions/${id}`, {
      scheduledAt,
      status,
      notes,
      meetingLink,
    }),

  // Reviews
  submitReview: (swapId: string, rating: number, comment?: string) =>
    api.post<ReviewDto>(`/api/swaps/${swapId}/reviews`, { rating, comment }),
};
