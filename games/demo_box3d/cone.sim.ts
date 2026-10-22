// A cone of the shape gallery: Box3D's `cone`, the hull `b3CreateCone` makes, its base on the body's origin.
// A body of box3d: its kind's Body is `world.box3d.kinds.cone` in the scene file, and box3d moves
// its row (`pos`, `rot`, `vel`, `spin`, `awake`). It has no rule of its own.
import type { Kind } from '#engine/engine.ts'

export const cone: Kind = {}
