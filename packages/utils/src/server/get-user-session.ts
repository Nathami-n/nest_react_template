
import { ApiClient } from "@repo/api/client";
import type { BaseResponse, UserSession } from "@repo/validation";

export async function getUserSessionFromServer(baseURL: string) {
    const client = new ApiClient({
        baseURL,
        withCredentials: true,
    });

    return await client.getSafe<BaseResponse<UserSession>>("/auth/me");
}


