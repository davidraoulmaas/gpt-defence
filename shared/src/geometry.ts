/** A 2-D point or vector. */
export interface Vec2 {
  x: number;
  y: number;
}

/** A waypoint on the enemy path. */
export interface PathNode extends Vec2 {
  /** Optional label for debugging. */
  label?: string;
}
