import { userContext } from "@/context/auth-context";
import { href, redirect } from "react-router";
import { VITE_API_URL } from "@/env/env.client";
import { getUserSessionFromServer } from "@repo/utils";
import { USER_ROLES } from "@repo/validation";

export const authMiddleware = (loader: any) => {
    return async (args: any) => {
        const { context } = args;
        const { data: session, error, success } = await getUserSessionFromServer(
            VITE_API_URL
        );

        if (!success || !session) {
            console.error("Auth middleware failed:", error);
            throw redirect("/auth/login");
        }

        // Platform admins bypass email verification
        const isPlatformAdmin = session.data.role === USER_ROLES.PLATFORM_ADMIN;

        // Check if email is verified (skip for platform admins)
        if (!isPlatformAdmin && !session.data.emailVerified) {
            throw redirect(
                `/auth/verify-email?email=${encodeURIComponent(session.data.email)}`
            );
        }

        context.set(userContext, session.data);
        return loader(args);
    };
};
