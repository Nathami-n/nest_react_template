import { type UseMutationOptions } from "@tanstack/react-query";
import { queryKeys, queryClient } from "@/lib";
import { authApi } from "@/features/auth/api/auth.api";

export const logoutMutation: UseMutationOptions<unknown, Error, void> = {
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
        // Clear all auth-related queries
        queryClient.removeQueries({ queryKey: queryKeys.auth.all });
    },
};
