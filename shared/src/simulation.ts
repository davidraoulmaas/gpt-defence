/**
 * Result returned by the headless battle simulator.
 */
export interface SimulationResult {
  /** Simulated seconds until the last enemy is destroyed (or Infinity if not cleared). */
  timeToClear: number;
  /** Total damage dealt by the tower across the simulation. */
  damageDealt: number;
  /** Number of enemies that survived. */
  enemiesRemaining: number;
}
