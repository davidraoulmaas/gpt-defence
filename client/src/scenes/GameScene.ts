import Phaser from "phaser";
import { Enemy } from "../entities/Enemy";
import { Tower } from "../entities/Tower";
import { generateTower } from "../api/towerApi";
import type { TowerDefinition, Vec2 } from "@gpt-defence/shared";

// ---------------------------------------------------------------------------
// Path waypoints — simple L-shaped route across the 800×480 canvas
// ---------------------------------------------------------------------------
const PATH: Vec2[] = [
  { x: -20, y: 240 },
  { x: 200, y: 240 },
  { x: 200, y: 100 },
  { x: 600, y: 100 },
  { x: 600, y: 380 },
  { x: 820, y: 380 },
];

// Default tower definition used at startup (no LLM required)
const DEFAULT_TOWER: TowerDefinition = {
  name: "Basic Turret",
  damage: 30,
  range: 180,
  fireRate: 1,
  cost: 100,
  effect: "none",
  description: "A simple auto-targeting turret.",
};

export class GameScene extends Phaser.Scene {
  private enemies: Enemy[] = [];
  private towers: Tower[] = [];
  private bullets: Phaser.GameObjects.Arc[] = [];

  private spawnTimer = 0;
  private spawnInterval = 2000; // ms between enemy spawns
  private gold = 200;
  private lives = 20;

  private goldText!: Phaser.GameObjects.Text;
  private livesText!: Phaser.GameObjects.Text;
  private infoText!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: "GameScene" });
  }

  create(): void {
    this.drawPath();
    this.createHUD();
    this.placeTower(400, 250, DEFAULT_TOWER);
    this.bindUI();
  }

  update(_time: number, delta: number): void {
    this.spawnTimer += delta;
    if (this.spawnTimer >= this.spawnInterval) {
      this.spawnTimer = 0;
      this.spawnEnemy();
    }

    // Update enemies
    for (const enemy of this.enemies) {
      enemy.update(delta);
      if (enemy.hasReachedEnd && enemy.isAlive) {
        this.lives = Math.max(0, this.lives - 1);
        this.livesText.setText(`Lives: ${this.lives}`);
        enemy.destroy();
      }
    }

    // Remove dead / arrived enemies
    this.enemies = this.enemies.filter((e) => e.isAlive && !e.hasReachedEnd);

    // Update towers
    for (const tower of this.towers) {
      tower.update(delta, this.enemies, (target, damage) => {
        this.fireBullet(tower.x, tower.y, target, damage);
      });
    }

    // Animate bullets
    for (const bullet of this.bullets) {
      if (!bullet.active) continue;
    }
  }

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  private drawPath(): void {
    const g = this.add.graphics();
    g.lineStyle(40, 0x8b7355, 1);
    g.beginPath();
    g.moveTo(PATH[0].x, PATH[0].y);
    for (let i = 1; i < PATH.length; i++) {
      g.lineTo(PATH[i].x, PATH[i].y);
    }
    g.strokePath();
  }

  private spawnEnemy(): void {
    const def = {
      name: "Grunt",
      hp: 100,
      speed: 80,
      reward: 10,
      damage: 1,
    };
    const enemy = new Enemy(this, def, PATH);
    this.enemies.push(enemy);
  }

  private placeTower(x: number, y: number, def: TowerDefinition): void {
    const tower = new Tower(this, x, y, def);
    this.towers.push(tower);
    this.infoText.setText(`Placed: ${def.name}`);
  }

  private fireBullet(
    fromX: number,
    fromY: number,
    target: Enemy,
    damage: number
  ): void {
    const bullet = this.add.circle(fromX, fromY, 4, 0xffd700);

    this.tweens.add({
      targets: bullet,
      x: target.x,
      y: target.y,
      duration: 80,
      onComplete: () => {
        const killed = target.takeDamage(damage);
        if (killed) {
          this.gold += target.reward;
          this.goldText.setText(`Gold: ${this.gold}`);
        }
        bullet.destroy();
      },
    });
  }

  private createHUD(): void {
    const style = { fontSize: "14px", color: "#ffffff", fontFamily: "monospace" };
    this.goldText = this.add.text(10, 10, `Gold: ${this.gold}`, style).setDepth(10);
    this.livesText = this.add.text(10, 30, `Lives: ${this.lives}`, style).setDepth(10);
    this.infoText = this.add.text(10, 50, "", { ...style, color: "#aaaaff" }).setDepth(10);
  }

  private bindUI(): void {
    const btn = document.getElementById("generate-btn") as HTMLButtonElement;
    const input = document.getElementById("prompt-input") as HTMLInputElement;
    const status = document.getElementById("status") as HTMLDivElement;

    btn?.addEventListener("click", async () => {
      const prompt = input?.value.trim();
      if (!prompt) return;

      btn.disabled = true;
      status.textContent = "Generating tower…";

      try {
        const def = await generateTower(prompt);
        status.textContent = `Generated: ${def.name} (cost ${def.cost}g)`;

        if (this.gold >= def.cost) {
          this.gold -= def.cost;
          this.goldText.setText(`Gold: ${this.gold}`);
          // Place the new tower at a fixed second slot
          this.placeTower(200, 320, def);
        } else {
          status.textContent = `Not enough gold for ${def.name} (need ${def.cost}g)`;
        }
      } catch (err) {
        status.textContent = `Error: ${(err as Error).message}`;
      } finally {
        btn.disabled = false;
      }
    });
  }
}
