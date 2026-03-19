import { SignupForm, signupMutation, authApi } from "@/features/auth";
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

export default function SignupRoute() {
  const navigate = useNavigate();
  const signup = useMutation(signupMutation);

  const handleSignup = async (data: any) => {
    try {
      await signup.mutateAsync(data);
      navigate("/auth/verify-email");
    } catch (error) {
      console.error("Signup failed:", error);
    }
  };

  const handleGoogleSignup = () => {
    authApi.googleLogin();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex justify-center">
          <Logo size="lg" showText text="NestReact" direction="vertical" />
        </div>

        <SignupForm
          onSubmit={handleSignup}
          onGoogleSignup={handleGoogleSignup}
          isLoading={signup.isPending}
          error={signup.error?.message}
        />

        <p className="text-muted-foreground text-center text-sm">
          Already have an account?{" "}
          <a href="/auth/login" className="text-primary hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
