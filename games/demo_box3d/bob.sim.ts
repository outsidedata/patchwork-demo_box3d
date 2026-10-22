// The pendulum's bob: a heavy sphere hung by the `rope` distance joint from the gallows' beam.
// A body of box3d: its kind's Body is `world.box3d.kinds.bob` in the scene file, and box3d moves
// its row (`pos`, `rot`, `vel`, `spin`, `awake`). It has no rule of its own.
import type { Kind } from '#engine/engine.ts'

export const bob: Kind = {}
