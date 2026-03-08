import type {
  TowerDefinition,
  WaveDefinition,
  EnemyDefinition,
  SimulationResult,
} from "@gpt-defence/shared";

// ---------------------------------------------------------------------------
// Internal mutable state for a single simulation run
// ---------------------------------------------------------------------------

interface LiveEnemy {
  def: EnemyDefinition;
  hp: number;
  /** Seconds until this enemy enters the field (used for staggered spawning). */
  spawnAt: number;
  /** Whether the enemy is on the field. */
  active: boolean;
}

interface TowerState {
  def: TowerDefinition;
  /** Seconds until the tower can fire again. */
  cooldown: number;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const TIME_STEP = 0.05; // seconds per simulation tick (50 ms)
const MAX_TIME = 600; // abort after 10 in-game minutes

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Simulate a single tower defending against a single wave.
 * Runs in O(T × E) where T = ticks, E = enemy count.
 *
 * @returns SimulationResult with timeToClear, damageDealt, enemiesRemaining
 */
export function simulateTowerVsWave(
  tower: TowerDefinition,
  wave: WaveDefinition
): SimulationResult {
  // Build the enemy list with staggered spawn times
  const enemies: LiveEnemy[] = [];
  let spawnCursor = 0;

  for (const group of wave.groups) {
    for (let i = 0; i < group.count; i++) {
      enemies.push({
        def: group.enemy,
        hp: group.enemy.hp,
        spawnAt: spawnCursor,
        active: false,
      });
      spawnCursor += group.spawnInterval;
    }
  }

  const towerState: TowerState = {
    def: tower,
    cooldown: 0,
  };

  let time = 0;
  let totalDamage = 0;
  let lastEnemyDeathTime = 0;

  // ---------------------------------------------------------------------------
  // Main simulation loop
  // ---------------------------------------------------------------------------
  while (time < MAX_TIME) {
    // Activate newly spawned enemies
    for (const e of enemies) {
      if (!e.active && e.spawnAt <= time) {
        e.active = true;
      }
    }

    const activeEnemies = enemies.filter((e) => e.active && e.hp > 0);
    if (activeEnemies.length === 0 && time >= spawnCursor) {
      // All enemies defeated or not yet spawned and spawn time is past
      break;
    }

    // Tower fires at the first alive enemy in range
    // (in a real sim enemies would have positions; here we assume they're
    //  always in range once active, which is the worst-case / stress scenario)
    towerState.cooldown -= TIME_STEP;
    if (towerState.cooldown <= 0 && activeEnemies.length > 0) {
      const target = activeEnemies[0];
      const dmg = tower.damage;

      target.hp -= dmg;
      totalDamage += dmg;
      towerState.cooldown = 1 / tower.fireRate;

      if (target.hp <= 0) {
        target.hp = 0;
        lastEnemyDeathTime = time;
      }
    }

    time += TIME_STEP;
  }

  const remaining = enemies.filter((e) => e.hp > 0).length;

  return {
    timeToClear: remaining === 0 ? lastEnemyDeathTime : Infinity,
    damageDealt: totalDamage,
    enemiesRemaining: remaining,
  };
}
