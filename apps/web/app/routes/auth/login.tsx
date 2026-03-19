import { LoginForm, loginMutation, authApi } from "@/features/auth";
import { Logo } from "@repo/ui/components";
import { href, redirect, useNavigate } from "react-router";
import { getUserSessionFromServer } from "@repo/utils";
import { VITE_API_URL } from "@/env/env.client";
import { useMutation } from "@tanstack/react-query";

export async function clientLoader() {
  // Check if user is already logged in
  const { data: user, success } = await getUserSessionFromServer(VITE_API_URL);

  if (success && user) {
    // Already logged in, redirect to dashboard
    throw redirect("/dashboard");
  }

  return {};
}

export default function LoginRoute() {
  const navigate = useNavigate();
  const login = useMutation(loginMutation);

  const handleLogin = async (data: { email: string; password: string }) => {
    try {
      await login.mutateAsync(data);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleGoogleLogin = () => {
    authApi.googleLogin();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex justify-center">
          <Logo size="lg" showText text="NestReact" direction="vertical" />
        </div>

        <LoginForm
          onSubmit={handleLogin}
          onGoogleLogin={handleGoogleLogin}
          isLoading={login.isPending}
          error={login.error?.message}
        />

        <p className="text-muted-foreground text-center text-sm">
          Don't have an account?{" "}
          <a href="/auth/signup" className="text-primary hover:underline">
            Sign up
          </a>
        </p>
        <p className="text-muted-foreground text-center text-sm">
          <a
            href="/auth/forgot-password"
            className="text-primary hover:underline"
          >
            Forgot your password?
          </a>
        </p>
      </div>
    </div>
  );
}
