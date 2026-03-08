import { WaveSchema } from "@gpt-defence/schemas";
import type { WaveDefinition } from "@gpt-defence/shared";

/**
 * Parse raw LLM output string into a validated WaveDefinition.
 * Throws a ZodError if the JSON does not match the schema.
 */
export function validateWave(raw: string): WaveDefinition {
  const parsed: unknown = JSON.parse(raw);
  return WaveSchema.parse(parsed) as WaveDefinition;
}
