import { useState } from "react";
import { Button, Input, FormLabel } from "@repo/ui/components";
import { authApi } from "@/features/auth";

export default function ForgotPasswordRoute() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            await authApi.forgotPassword(email);
            setSuccess(true);
        } catch (err: any) {
            setError(err.message || "Failed to send reset email");
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background px-4">
                <div className="w-full max-w-md space-y-6 rounded-lg border bg-card p-8 shadow-sm">
                    <div className="space-y-2 text-center">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                            <svg
                                className="h-6 w-6 text-green-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold">Check Your Email</h1>
                        <p className="text-muted-foreground">
                            We've sent password reset instructions to {email}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4">
            <div className="w-full max-w-md space-y-6 rounded-lg border bg-card p-8 shadow-sm">
                <div className="space-y-2 text-center">
                    <h1 className="text-3xl font-bold">Forgot Password?</h1>
                    <p className="text-muted-foreground">
                        Enter your email to receive a password reset link
                    </p>
                </div>

                {error && (
                    <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <FormLabel htmlFor="email">Email</FormLabel>
                        <Input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isLoading}
                            required
                        />
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Sending..." : "Send Reset Link"}
                    </Button>
                </form>

                <div className="text-center text-sm">
                    <a href="/auth/login" className="text-primary hover:underline">
                        Back to login
                    </a>
                </div>
            </div>
        </div>
    );
}
