import { z } from "zod";
import { EnemySchema } from "./enemy.schema";

export const WaveGroupSchema = z.object({
  enemy: EnemySchema,
  count: z.number().int().min(1).max(200),
  spawnInterval: z.number().min(0.1).max(10),
});

export const WaveSchema = z.object({
  waveNumber: z.number().int().min(1),
  groups: z.array(WaveGroupSchema).min(1).max(10),
});

export type WaveSchema = z.infer<typeof WaveSchema>;
