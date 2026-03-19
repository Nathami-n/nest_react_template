import {
  Button,
  FormField,
  FormControl,
  FormLabel,
  FormMessage,
  Input,
} from "@repo/ui/components";
import { GoogleIconSVG } from "@repo/ui/icons";
import { useFormEngine } from "@repo/form-engine";
import type { FormConfig } from "@repo/form-engine";
import { loginSchema, type LoginInput } from "@repo/validation";

interface LoginFormProps {
  onSubmit: (data: LoginInput) => void | Promise<void>;
  onGoogleLogin?: () => void;
  isLoading?: boolean;
  error?: string | null;
}

export function LoginForm({
  onSubmit,
  onGoogleLogin,
  isLoading,
  error,
}: LoginFormProps) {
  const formConfig: FormConfig<LoginInput> = {
    fields: [
      {
        name: "email",
        label: "Email",
        type: "email",
        placeholder: "you@example.com",
        autoComplete: "email",
      },
      {
        name: "password",
        label: "Password",
        type: "password",
        placeholder: "Enter your password",
        autoComplete: "current-password",
      },
    ],
    schema: loginSchema,
    defaultValues: {
      email: "",
      password: "",
    },
  };

  const { form, fields } = useFormEngine(formConfig);

  return (
    <div className="w-full max-w-md space-y-6 rounded-lg border bg-card p-8 shadow-sm">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Welcome Back</h1>
        <p className="text-muted-foreground">
          Enter your credentials to access your account
        </p>
      </div>

      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {fields.map((field) => (
          <FormField
            key={field.name}
            control={form.control as any}
            name={field.name as keyof LoginInput}
          >
            <FormLabel>{field.label}</FormLabel>
            <FormControl>
              {({ field: fieldProps }) => (
                <Input
                  {...fieldProps}
                  type={field.type}
                  placeholder={field.placeholder}
                  autoComplete={field.autoComplete}
                  disabled={isLoading}
                />
              )}
            </FormControl>
            <FormMessage />
          </FormField>
        ))}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      {onGoogleLogin && (
        <>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={onGoogleLogin}
            disabled={isLoading}
          >
            <GoogleIconSVG className="mr-2" />
            Continue with Google
          </Button>
        </>
      )}
    </div>
  );
}
