import { queryOptions } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { usersApi } from "../api/users.api";

export const usersQueries = {
  list: (page = 1, limit = 20, search?: string) =>
    queryOptions({
      queryKey: queryKeys.users.list(page, limit, search),
      queryFn: () => usersApi.getAll(page, limit),
    }),

  detail: (id: string) =>
    queryOptions({
      queryKey: queryKeys.users.detail(id),
      queryFn: () => usersApi.getOne(id),
    }),
};
