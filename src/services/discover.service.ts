import { api } from './api';
import type { DiscoverDto, TrackEventRequest } from '@/types/api';

export const discoverService = {
  getDiscover: () => api.get<DiscoverDto>('/api/discover'),

  trackEvent: (event: TrackEventRequest) => api.post<void>('/api/events', event),
};
