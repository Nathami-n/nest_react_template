import { type UseMutationOptions } from "@tanstack/react-query";
import { queryKeys, queryClient } from "@/lib";
import type { SignupInput } from "@repo/validation";
import { authApi } from "@/features/auth/api/auth.api";

export const signupMutation: UseMutationOptions<
    unknown,
    Error,
    SignupInput
> = {
    mutationFn: (data: SignupInput) => authApi.signup(data),
    onSuccess: () => {
        // Invalidate session to refetch user data
        queryClient.invalidateQueries({ queryKey: queryKeys.auth.all });
    },
};
