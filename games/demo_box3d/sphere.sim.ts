// A sphere of the shape gallery: Box3D's `sphere`, a centre and a radius.
// A body of box3d: its kind's Body is `world.box3d.kinds.sphere` in the scene file, and box3d moves
// its row (`pos`, `rot`, `vel`, `spin`, `awake`). It has no rule of its own.
import type { Kind } from '#engine/engine.ts'

export const sphere: Kind = {}
