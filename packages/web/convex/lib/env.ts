import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    CONVEX_SITE_URL: z.url(),
    ASANA_CLIENT_ID: z.string().min(1),
    ASANA_CLIENT_SECRET: z.string().min(1),
    OPENROUTER_API_KEY: z.string().min(1),
    AUTH_RESEND_KEY: z.string().min(1),
  },
  runtimeEnv: process.env,
});
