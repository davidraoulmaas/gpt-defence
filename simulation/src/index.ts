/**
 * Entry point for the headless simulation runner.
 *
 * Run:  npm run simulate
 *
 * This demonstrates simulateTowerVsWave with a few sample combinations
 * so you can sanity-check balance numbers without starting the game.
 */

import { simulateTowerVsWave } from "./simulator.js";
import type { TowerDefinition, WaveDefinition } from "@gpt-defence/shared";

// ---------------------------------------------------------------------------
// Sample data
// ---------------------------------------------------------------------------

const basicTurret: TowerDefinition = {
  name: "Basic Turret",
  damage: 30,
  range: 180,
  fireRate: 1,
  cost: 100,
  effect: "none",
};

const frostCannon: TowerDefinition = {
  name: "Frost Cannon",
  damage: 320,
  range: 160,
  fireRate: 0.3,
  cost: 650,
  effect: "freeze",
};

const lightWave: WaveDefinition = {
  waveNumber: 1,
  groups: [
    {
      enemy: { name: "Grunt", hp: 80, speed: 60, reward: 10, damage: 1 },
      count: 10,
      spawnInterval: 1,
    },
  ],
};

const heavyWave: WaveDefinition = {
  waveNumber: 10,
  groups: [
    {
      enemy: { name: "Brute", hp: 600, speed: 40, reward: 50, damage: 5 },
      count: 5,
      spawnInterval: 2,
    },
    {
      enemy: { name: "Speeder", hp: 80, speed: 200, reward: 8, damage: 2 },
      count: 20,
      spawnInterval: 0.3,
    },
  ],
};

// ---------------------------------------------------------------------------
// Run
// ---------------------------------------------------------------------------

const scenarios: Array<{ tower: TowerDefinition; wave: WaveDefinition }> = [
  { tower: basicTurret, wave: lightWave },
  { tower: basicTurret, wave: heavyWave },
  { tower: frostCannon, wave: lightWave },
  { tower: frostCannon, wave: heavyWave },
];

console.log("=".repeat(60));
console.log("  GPT Defence — Headless Battle Simulator");
console.log("=".repeat(60));

for (const { tower, wave } of scenarios) {
  const result = simulateTowerVsWave(tower, wave);

  console.log(
    `\nTower  : ${tower.name} (dmg ${tower.damage} | rate ${tower.fireRate}/s)`
  );
  console.log(
    `Wave   : #${wave.waveNumber} — ${wave.groups.map((g) => `${g.count}× ${g.enemy.name}`).join(", ")}`
  );
  console.log(`Result :`);
  console.log(
    `  timeToClear      = ${result.timeToClear === Infinity ? "∞ (wave not cleared)" : `${result.timeToClear.toFixed(2)}s`}`
  );
  console.log(`  damageDealt      = ${result.damageDealt}`);
  console.log(`  enemiesRemaining = ${result.enemiesRemaining}`);
}

console.log("\n" + "=".repeat(60));
