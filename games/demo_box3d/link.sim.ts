// A link of the welded chain: each held to the one before, the first to its post, by a `weld` joint.
// A body of box3d: its kind's Body is `world.box3d.kinds.link` in the scene file, and box3d moves
// its row (`pos`, `rot`, `vel`, `spin`, `awake`). It has no rule of its own.
import type { Kind } from '#engine/engine.ts'

export const link: Kind = {}
