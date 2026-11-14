import { api } from './api';
import type { NotificationDto } from '@/types/api';

export const notificationsService = {
  list: (unreadOnly = false) =>
    api.get<NotificationDto[]>(`/api/notifications?unreadOnly=${unreadOnly}`),

  markRead: (id: number) => api.post<void>(`/api/notifications/${id}/read`),
};
