import { queryOptions } from "@tanstack/react-query";
import { queryKeys } from "@/lib";
import { authApi } from "@/features/auth/api/auth.api";

export const authQueries = {
    session: () =>
        queryOptions({
            queryKey: queryKeys.auth.session(),
            queryFn: authApi.getSession,
            staleTime: 5 * 60 * 1000, // 5 minutes
            retry: false,
        }),
};
