import { z } from "zod";

export const EnemySchema = z.object({
  /** Display name. */
  name: z.string().min(1).max(40),

  /** Maximum health points. */
  hp: z.number().int().min(1).max(100_000),

  /** Movement speed in game units per second. */
  speed: z.number().min(10).max(1_000),

  /** Gold reward awarded to the player on kill. */
  reward: z.number().int().min(0).max(1_000),

  /** Damage dealt to the player's base if this enemy reaches the end. */
  damage: z.number().int().min(1).max(100),

  /** Flavour description — optional. */
  description: z.string().max(200).optional(),
});

export type EnemySchema = z.infer<typeof EnemySchema>;
