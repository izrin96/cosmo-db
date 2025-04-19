import { z } from "zod";
import { baseEnvSchema } from "./base";

const envSchema = z
  .object({
    RPC_RATE_LIMIT: z.coerce.number().positive().default(2),
    RPC_FINALITY: z.coerce.number().positive().default(60),
    RPC_ENDPOINT: z.string().url(),
    SQD_ENDPOINT: z.string().url(),
    ENABLE_OBJEKTS: z.preprocess((x) => x === "true", z.coerce.boolean()),
    ENABLE_GRAVITY: z.preprocess((x) => x === "true", z.coerce.boolean()),
    COSMO_PARALLEL_COUNT: z.coerce.number().positive().default(500),
    ABLY_API_KEY: z.string().min(1),
  })
  .merge(baseEnvSchema);

export const env = envSchema.parse(process.env);
