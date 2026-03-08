import Phaser from "phaser";
import type { EnemyDefinition, Vec2 } from "@gpt-defence/shared";

/**
 * An enemy sprite that walks along a predefined path of waypoints.
 */
export class Enemy extends Phaser.GameObjects.Container {
  private def: EnemyDefinition;
  private path: Vec2[];
  private currentNodeIndex = 1;
  private _hp: number;

  /** Health bar background */
  private barBg: Phaser.GameObjects.Rectangle;
  /** Health bar fill */
  private barFill: Phaser.GameObjects.Rectangle;
  /** Body circle */
  private body_: Phaser.GameObjects.Arc;

  constructor(
    scene: Phaser.Scene,
    def: EnemyDefinition,
    path: Vec2[]
  ) {
    super(scene, path[0].x, path[0].y);
    this.def = def;
    this.path = path;
    this._hp = def.hp;

    // Body
    this.body_ = scene.add.circle(0, 0, 10, 0xe74c3c);

    // Health bar
    this.barBg = scene.add.rectangle(0, -18, 24, 4, 0x333333);
    this.barFill = scene.add.rectangle(0, -18, 24, 4, 0x2ecc71);

    this.add([this.body_, this.barBg, this.barFill]);
    scene.add.existing(this);
  }

  get hp(): number {
    return this._hp;
  }

  get isAlive(): boolean {
    return this._hp > 0;
  }

  get speed(): number {
    return this.def.speed;
  }

  get reward(): number {
    return this.def.reward;
  }

  /** Apply damage and return true if the enemy died. */
  takeDamage(amount: number): boolean {
    this._hp = Math.max(0, this._hp - amount);
    this.updateHealthBar();
    if (this._hp <= 0) {
      this.destroy();
      return true;
    }
    return false;
  }

  /** Returns true when the enemy has reached the final waypoint. */
  get hasReachedEnd(): boolean {
    return this.currentNodeIndex >= this.path.length;
  }

  update(delta: number): void {
    if (this.hasReachedEnd || !this.isAlive) return;

    const target = this.path[this.currentNodeIndex];
    const dx = target.x - this.x;
    const dy = target.y - this.y;
    const dist = Math.hypot(dx, dy);

    const step = (this.def.speed * delta) / 1000;

    if (dist <= step) {
      // Snap to node and advance
      this.setPosition(target.x, target.y);
      this.currentNodeIndex++;
    } else {
      this.setPosition(this.x + (dx / dist) * step, this.y + (dy / dist) * step);
    }
  }

  private updateHealthBar(): void {
    const ratio = this._hp / this.def.hp;
    this.barFill.setSize(24 * ratio, 4);
    // Shift origin so bar shrinks left-to-right
    this.barFill.setX(-12 + (24 * ratio) / 2 - 12);
  }
}
