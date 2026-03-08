import type { TowerDefinition } from "@gpt-defence/shared";

const API_BASE = "/generate-tower";

/**
 * Ask the server to generate a tower from a natural language prompt.
 */
export async function generateTower(prompt: string): Promise<TowerDefinition> {
  const response = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    const err = (await response.json()) as { error: string };
    throw new Error(err.error ?? "Unknown server error");
  }

  return response.json() as Promise<TowerDefinition>;
}
