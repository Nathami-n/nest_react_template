import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Button, Input, FormLabel } from "@repo/ui/components";
import { authApi } from "@/features/auth";

export default function ResetPasswordRoute() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!token) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background px-4">
                <div className="w-full max-w-md space-y-6 rounded-lg border bg-card p-8 shadow-sm">
                    <div className="space-y-2 text-center">
                        <h1 className="text-3xl font-bold text-destructive">Invalid Link</h1>
                        <p className="text-muted-foreground">
                            This password reset link is invalid or has expired
                        </p>
                        <Button onClick={() => navigate("/auth/forgot-password")} className="mt-4">
                            Request New Link
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters");
            return;
        }

        setIsLoading(true);

        try {
            await authApi.resetPassword(token, password);
            navigate("/auth/login?reset=success");
        } catch (err: any) {
            setError(err.message || "Failed to reset password");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4">
            <div className="w-full max-w-md space-y-6 rounded-lg border bg-card p-8 shadow-sm">
                <div className="space-y-2 text-center">
                    <h1 className="text-3xl font-bold">Reset Password</h1>
                    <p className="text-muted-foreground">
                        Enter your new password below
                    </p>
                </div>

                {error && (
                    <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <FormLabel htmlFor="password">New Password</FormLabel>
                        <Input
                            id="password"
                            type="password"
                            placeholder="Enter new password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLoading}
                            required
                            minLength={8}
                        />
                    </div>

                    <div className="space-y-2">
                        <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
                        <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            disabled={isLoading}
                            required
                            minLength={8}
                        />
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Resetting..." : "Reset Password"}
                    </Button>
                </form>
            </div>
        </div>
    );
}
