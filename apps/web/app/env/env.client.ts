
import { z } from "zod";
import { cleanEnv } from "@repo/utils/env";


const clientEnvSchema = z.object({
    VITE_API_URL: z.string(),
    NODE_ENV: z
        .enum(["development", "production", "test"])
        .default("development"),
});

const clientEnv = clientEnvSchema.parse(cleanEnv(import.meta.env));
export const { VITE_API_URL, NODE_ENV } = clientEnv;