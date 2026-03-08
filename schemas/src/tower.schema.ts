import { z } from "zod";

export const TowerEffectSchema = z.enum([
  "none",
  "slow",
  "burn",
  "freeze",
  "poison",
]);

export const TowerSchema = z.object({
  /** Display name of the tower. Max 40 chars to keep the UI clean. */
  name: z.string().min(1).max(40),

  /** Damage per shot — clamped to a sensible game range. */
  damage: z.number().int().min(1).max(10_000),

  /** Detection radius in game units (grid cell = 64 px). */
  range: z.number().min(50).max(800),

  /** Shots per second. Below 0.1 is too slow; above 20 is machine-gun tier. */
  fireRate: z.number().min(0.1).max(20),

  /** Gold cost. Forces the LLM to consider balance. */
  cost: z.number().int().min(10).max(5_000),

  /** Optional status effect applied on hit. Defaults to "none". */
  effect: TowerEffectSchema.default("none"),

  /** Flavour description shown in the UI — optional. */
  description: z.string().max(200).optional(),
});

export type TowerSchema = z.infer<typeof TowerSchema>;
