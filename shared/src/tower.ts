/** Status effects a tower can apply to enemies. */
export type TowerEffect = "none" | "slow" | "burn" | "freeze" | "poison";

/**
 * A tower definition returned by the LLM and validated by TowerSchema.
 * This is the data contract between the server, client, and simulation.
 */
export interface TowerDefinition {
  /** Display name of the tower. */
  name: string;
  /** Damage dealt per shot. */
  damage: number;
  /** Detection radius in game units. */
  range: number;
  /** Shots per second. */
  fireRate: number;
  /** Gold cost to place. */
  cost: number;
  /** Optional status effect applied on hit. */
  effect: TowerEffect;
  /** Flavour description shown in the UI. */
  description?: string;
}
