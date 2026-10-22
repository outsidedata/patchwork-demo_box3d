// A rock of the shape gallery: Box3D's `rock`, the hull `b3CreateRock` makes of its radius.
// A body of box3d: its kind's Body is `world.box3d.kinds.rock` in the scene file, and box3d moves
// its row (`pos`, `rot`, `vel`, `spin`, `awake`). It has no rule of its own.
import type { Kind } from '#engine/engine.ts'

export const rock: Kind = {}
