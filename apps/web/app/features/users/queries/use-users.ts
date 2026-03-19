import { useQuery } from "@tanstack/react-query";
import { usersQueries } from "./users.queries";

export const useUsers = (page: number = 1, limit: number = 20, search?: string) => {
  return useQuery(usersQueries.list(page, limit, search));
};

export const useUser = (id: string) => {
  return useQuery(usersQueries.detail(id));
};
