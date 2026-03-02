export function cleanEnv(env: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(env).map(([key, value]) => [
      key,
      value === "" ? undefined : value,
    ])
  );
}