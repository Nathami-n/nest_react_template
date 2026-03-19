import { type UseMutationOptions } from "@tanstack/react-query";
import { authApi } from "@/features/auth/api/auth.api";
import { queryKeys, queryClient } from "@/lib";
import type { LoginInput } from "@repo/validation";

export const loginMutation: UseMutationOptions<
    unknown,
    Error,
    LoginInput
> = {
    mutationFn: (data: LoginInput) => authApi.login(data),
    onSuccess: () => {
        // Invalidate session to refetch user data
        queryClient.invalidateQueries({ queryKey: queryKeys.auth.all });
    },
};
