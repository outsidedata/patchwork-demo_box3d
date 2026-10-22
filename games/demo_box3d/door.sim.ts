// The door, swung on the `hinge` revolute joint from its post.
// A body of box3d: its kind's Body is `world.box3d.kinds.door` in the scene file, and box3d moves
// its row (`pos`, `rot`, `vel`, `spin`, `awake`). It has no rule of its own.
import type { Kind } from '#engine/engine.ts'

export const door: Kind = {}
