import { z } from "zod";
import process from "node:process";

const envSchema = z.object({
  TAVILY_API_KEY: z.string(),
  ANTHROPIC_API_KEY: z.string(),
});

const env = envSchema.parse(process.env);

export default env;
