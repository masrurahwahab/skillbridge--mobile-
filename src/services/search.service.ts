import { api } from './api';
import type { SearchResultDto } from '@/types/api';

export const searchService = {
  search: (query: string) =>
    api.get<SearchResultDto>(`/api/search?q=${encodeURIComponent(query)}`),
};
