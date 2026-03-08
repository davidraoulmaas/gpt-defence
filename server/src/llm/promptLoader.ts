import { readFileSync } from "fs";
import { resolve } from "path";

/** Root of the repository — two levels up from server/src/llm/ */
const PROMPTS_DIR = resolve(__dirname, "../../../prompts");

/**
 * Load a prompt template file and substitute {{VARIABLE}} placeholders.
 *
 * @param filename  Filename inside the prompts/ directory, e.g. "tower_generation_v1.md"
 * @param vars      Key/value map of placeholder substitutions
 */
export function loadPrompt(
  filename: string,
  vars: Record<string, string> = {}
): string {
  const filePath = resolve(PROMPTS_DIR, filename);
  let template = readFileSync(filePath, "utf-8");

  for (const [key, value] of Object.entries(vars)) {
    template = template.replaceAll(`{{${key}}}`, value);
  }

  return template;
}
