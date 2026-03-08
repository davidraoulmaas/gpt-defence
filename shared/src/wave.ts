import type { EnemyDefinition } from "./enemy";

/**
 * A wave definition: a sequence of enemy spawn instructions.
 */
export interface WaveDefinition {
  /** Wave number (1-indexed). */
  waveNumber: number;
  /** Ordered list of enemy groups to spawn. */
  groups: WaveGroup[];
}

export interface WaveGroup {
  /** Enemy archetype for this group. */
  enemy: EnemyDefinition;
  /** How many of this enemy to spawn. */
  count: number;
  /** Delay between individual spawns within the group, in seconds. */
  spawnInterval: number;
}
