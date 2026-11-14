import { api } from './api';
import type { ImpactStatsDto } from '@/types/api';

export const impactService = {
  getStats: () => api.get<ImpactStatsDto>('/api/stats/impact'),
};
