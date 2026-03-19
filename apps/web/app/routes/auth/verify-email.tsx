import { useState } from "react";
import { useNavigate } from "react-router";
import { Button, Input } from "@repo/ui/components";

export default function VerifyEmailRoute() {
    const [otp, setOtp] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            // TODO: Implement OTP verification API call
            // await authApi.verifyEmail(otp);
            navigate("/dashboard");
        } catch (err: any) {
            setError(err.message || "Failed to verify email");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4">
            <div className="w-full max-w-md space-y-6 rounded-lg border bg-card p-8 shadow-sm">
                <div className="space-y-2 text-center">
                    <h1 className="text-3xl font-bold">Verify Your Email</h1>
                    <p className="text-muted-foreground">
                        Enter the verification code sent to your email
                    </p>
                </div>

                {error && (
                    <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                        {error}
                    </div>
                )}

                <form onSubmit={handleVerify} className="space-y-4">
                    <div className="space-y-2">
                        <Input
                            type="text"
                            placeholder="Enter 6-digit code"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            maxLength={6}
                            disabled={isLoading}
                            className="text-center text-2xl tracking-widest"
                        />
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading || otp.length !== 6}>
                        {isLoading ? "Verifying..." : "Verify Email"}
                    </Button>
                </form>

                <div className="text-center text-sm">
                    <button
                        type="button"
                        className="text-primary hover:underline"
                        disabled={isLoading}
                    >
                        Resend code
                    </button>
                </div>
            </div>
        </div>
    );
}
