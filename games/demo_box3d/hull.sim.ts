// A gem of the shape gallery: Box3D's `hull`, the convex hull of its kind's `points`.
// A body of box3d: its kind's Body is `world.box3d.kinds.hull` in the scene file, and box3d moves
// its row (`pos`, `rot`, `vel`, `spin`, `awake`). It has no rule of its own.
import type { Kind } from '#engine/engine.ts'

export const hull: Kind = {}
