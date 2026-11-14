import { api } from './api';
import type {
  SkillDto,
  PagedResult,
  MySkillsDto,
  UserSkillDto,
  SkillDetailDto,
  SkillType,
  SkillLevel,
} from '@/types/api';

export const skillsService = {
  search: (query?: string, category?: string, page = 1, pageSize = 20) =>
    api.get<PagedResult<SkillDto>>(
      `/api/skills?query=${encodeURIComponent(query ?? '')}&category=${encodeURIComponent(
        category ?? ''
      )}&page=${page}&pageSize=${pageSize}`
    ),
  get: (id: number) => api.get<SkillDetailDto>(`/api/skills/${id}`),
  categories: () => api.get<string[]>('/api/skills/categories'),
  mySkills: () => api.get<MySkillsDto>('/api/users/me/skills'),
  addSkill: (skillId: number, type: SkillType, level: SkillLevel, notes?: string) =>
    api.post<UserSkillDto>('/api/users/me/skills', { skillId, type, level, notes }),
  updateSkill: (id: number, level: SkillLevel, notes?: string) =>
    api.put<UserSkillDto>(`/api/users/me/skills/${id}`, { level, notes }),
  removeSkill: (id: number) => api.delete<void>(`/api/users/me/skills/${id}`),
};
