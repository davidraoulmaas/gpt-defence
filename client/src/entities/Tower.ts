import Phaser from "phaser";
import type { TowerDefinition } from "@gpt-defence/shared";
import type { Enemy } from "./Enemy";

/**
 * A tower that targets and shoots the first enemy within its range.
 */
export class Tower extends Phaser.GameObjects.Container {
  private def: TowerDefinition;
  private cooldown = 0; // seconds remaining until next shot

  /** Visual base */
  private base: Phaser.GameObjects.Rectangle;
  /** Visual barrel */
  private barrel: Phaser.GameObjects.Rectangle;
  /** Range indicator (hidden by default) */
  private rangeCircle: Phaser.GameObjects.Arc;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    def: TowerDefinition
  ) {
    super(scene, x, y);
    this.def = def;

    // Range indicator (semi-transparent, shown on hover)
    this.rangeCircle = scene.add.circle(0, 0, def.range, 0x4f7cff, 0.1);
    this.rangeCircle.setStrokeStyle(1, 0x4f7cff, 0.4);

    // Base square
    this.base = scene.add.rectangle(0, 0, 28, 28, 0x2c3e50);
    this.base.setStrokeStyle(2, 0x4f7cff);

    // Barrel
    this.barrel = scene.add.rectangle(0, -12, 6, 16, 0x4f7cff);

    this.add([this.rangeCircle, this.base, this.barrel]);
    scene.add.existing(this);

    // Show range on pointer over
    this.setSize(28, 28);
    this.setInteractive();
    this.on("pointerover", () => this.rangeCircle.setVisible(true));
    this.on("pointerout", () => this.rangeCircle.setVisible(false));
    this.rangeCircle.setVisible(false);
  }

  get definition(): TowerDefinition {
    return this.def;
  }

  /**
   * Call once per frame. Finds the nearest enemy in range and fires.
   * @param delta   Frame delta in milliseconds
   * @param enemies Active enemy list
   * @param onShot  Callback invoked with the targeted enemy when a shot fires
   */
  update(
    delta: number,
    enemies: Enemy[],
    onShot: (target: Enemy, damage: number) => void
  ): void {
    this.cooldown -= delta / 1000;
    if (this.cooldown > 0) return;

    const target = this.findTarget(enemies);
    if (!target) return;

    // Rotate barrel toward target
    const angle = Phaser.Math.Angle.Between(this.x, this.y, target.x, target.y);
    this.barrel.setRotation(angle + Math.PI / 2);

    // Fire
    onShot(target, this.def.damage);
    this.cooldown = 1 / this.def.fireRate;
  }

  private findTarget(enemies: Enemy[]): Enemy | null {
    let closest: Enemy | null = null;
    let closestDist = Infinity;

    for (const enemy of enemies) {
      if (!enemy.isAlive) continue;
      const d = Phaser.Math.Distance.Between(this.x, this.y, enemy.x, enemy.y);
      if (d <= this.def.range && d < closestDist) {
        closest = enemy;
        closestDist = d;
      }
    }

    return closest;
  }
}
