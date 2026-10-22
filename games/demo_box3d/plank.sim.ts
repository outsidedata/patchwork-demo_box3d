// The plank on the `spring` wheel joint over its pedestal: it bobs on the spring and tips about the axle.
// A body of box3d: its kind's Body is `world.box3d.kinds.plank` in the scene file, and box3d moves
// its row (`pos`, `rot`, `vel`, `spin`, `awake`). It has no rule of its own.
import type { Kind } from '#engine/engine.ts'

export const plank: Kind = {}
