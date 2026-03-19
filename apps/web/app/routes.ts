import {
    type RouteConfig,
    index,
    route,
    layout,
    prefix
} from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("/sitemap.xml", "routes/sitemap[.].xml.ts"),

    // Auth routes
    ...prefix("auth", [
        route("login", "routes/auth/login.tsx"),
        route("signup", "routes/auth/signup.tsx"),
        route("success", "routes/auth/success.tsx"),
        route("verify-email", "routes/auth/verify-email.tsx"),
        route("forgot-password", "routes/auth/forgot-password.tsx"),
        route("reset-password", "routes/auth/reset-password.tsx"),
    ]),

    // Dashboard routes (protected)
    ...prefix("dashboard", [
        layout("layouts/dashboard-layout.tsx", [
            index("routes/dashboard/index.tsx"),

            // Admin routes (Platform Admin only)
            ...prefix("admin", [
                route("users", "routes/dashboard/admin/users.tsx"),
            ]),

            // Settings routes
            ...prefix("settings", [
                layout("layouts/settings.tsx", [
                    index("routes/dashboard/settings/index.tsx"),
                    route("profile", "routes/dashboard/settings/profile.tsx"),
                    route("security", "routes/dashboard/settings/security.tsx"),
                ]),
            ]),
        ]),
    ]),
] satisfies RouteConfig;