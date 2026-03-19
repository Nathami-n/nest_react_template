import { useQuery } from "@tanstack/react-query";
import { authQueries } from "../queries/auth.queries";

export const useSession = () => {
    const { data, isLoading, error } = useQuery(authQueries.session());

    return {
        user: data?.data ?? null,
        isLoading,
        error,
        authenticated: !!data?.data && data?.success,
    };
};
