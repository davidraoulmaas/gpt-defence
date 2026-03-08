import Phaser from "phaser";
import { GameScene } from "./scenes/GameScene";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 480,
  backgroundColor: "#1e3a2f",
  parent: "game-container",
  scene: [GameScene],
};

new Phaser.Game(config);
