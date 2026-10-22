// A capsule of the shape gallery: Box3D's `capsule`, two centres and a radius, lying along x.
// A body of box3d: its kind's Body is `world.box3d.kinds.capsule` in the scene file, and box3d moves
// its row (`pos`, `rot`, `vel`, `spin`, `awake`). It has no rule of its own.
import type { Kind } from '#engine/engine.ts'

export const capsule: Kind = {}
