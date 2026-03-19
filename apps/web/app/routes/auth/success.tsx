import { useEffect } from "react";
import { useNavigate } from "react-router";

export default function AuthSuccessRoute() {
    const navigate = useNavigate();

    useEffect(() => {
        // Give time for the auth cookie to be set
        setTimeout(() => {
            navigate("/dashboard", { replace: true });
        }, 1000);
    }, [navigate]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-background">
            <div className="space-y-4 text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                <p className="text-muted-foreground">Completing sign in...</p>
            </div>
        </div>
    );
}
