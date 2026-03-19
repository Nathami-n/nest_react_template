import { apiClient } from "@/lib";
import type { LoginInput, SignupInput, BaseResponse, UserSession } from "@repo/validation";
import { VITE_API_URL } from "@/env/env.client";

export const authApi = {
    login: async (data: LoginInput) => {
        return apiClient.post<BaseResponse<unknown>>("/auth/login", data);
    },

    signup: async (data: SignupInput) => {
        return apiClient.post("/auth/signup", {
            email: data.email,
            password: data.password,
            name: data.name,
        });
    },

    logout: async () => {
        return apiClient.post("/auth/logout");
    },

    getSession: async () => {
        return apiClient.get<BaseResponse<UserSession>>("/auth/me");
    },

    refreshToken: async () => {
        return apiClient.post("/auth/refresh");
    },

    forgotPassword: async (email: string) => {
        return apiClient.post<{ message: string }>("/auth/forgot-password", { email });
    },

    resetPassword: async (token: string, password: string) => {
        return apiClient.post<{ message: string }>("/auth/reset-password", { token, password });
    },

    // Google OAuth - redirect to backend OAuth flow
    googleLogin: () => {
        window.location.href = `${VITE_API_URL}/auth/google`;
    },
};
