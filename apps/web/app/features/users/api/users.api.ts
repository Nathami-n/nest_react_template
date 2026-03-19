import { apiClient } from "@/lib";
import type { PaginatedResponse, User } from "@repo/validation";

export const usersApi = {
  getAll: async (page: number = 1, limit: number = 20) => {
    return apiClient.get<PaginatedResponse<User>>(`/users?page=${page}&limit=${limit}`);
  },

  getOne: async (id: string) => {
    return apiClient.get<{ success: boolean; data: User }>(`/users/${id}`);
  },

  updateStatus: async (id: string, isActive: boolean) => {
    return apiClient.patch<{ success: boolean; data: User }>(`/users/${id}/status`, {
      isActive,
    });
  },
};
