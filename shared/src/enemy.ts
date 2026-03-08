/**
 * A single enemy archetype returned by the LLM and validated by EnemySchema.
 */
export interface EnemyDefinition {
  /** Display name. */
  name: string;
  /** Maximum health points. */
  hp: number;
  /** Movement speed in game units per second. */
  speed: number;
  /** Gold reward on kill. */
  reward: number;
  /** Damage dealt to the player's base on reaching the end. */
  damage: number;
  /** Flavour description. */
  description?: string;
}
