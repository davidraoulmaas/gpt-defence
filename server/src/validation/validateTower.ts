import { TowerSchema } from "@gpt-defence/schemas";
import type { TowerDefinition } from "@gpt-defence/shared";

/**
 * Parse raw LLM output string into a validated TowerDefinition.
 * Throws a ZodError if the JSON does not match the schema.
 */
export function validateTower(raw: string): TowerDefinition {
  const parsed: unknown = JSON.parse(raw);
  return TowerSchema.parse(parsed) as TowerDefinition;
}
