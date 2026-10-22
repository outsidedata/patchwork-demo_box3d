// A drum of the shape gallery: Box3D's `cylinder`, the hull `b3CreateCylinder` makes of its height, radius and sides.
// A body of box3d: its kind's Body is `world.box3d.kinds.cylinder` in the scene file, and box3d moves
// its row (`pos`, `rot`, `vel`, `spin`, `awake`). It has no rule of its own.
import type { Kind } from '#engine/engine.ts'

export const cylinder: Kind = {}
