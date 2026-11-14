import { api } from './api';
import type { MatchDto, PagedResult } from '@/types/api';

export const matchesService = {
  getMatches: (kind: 'mutual' | 'partial' | 'chain' = 'mutual', page = 1, pageSize = 20) =>
    api.get<PagedResult<MatchDto>>(`/api/matches?kind=${kind}&page=${page}&pageSize=${pageSize}`),
};
