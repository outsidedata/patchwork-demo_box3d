// Where a seat's eye starts: a `start` actor of the scene, one per slot, holding the slot in `slot`,
// the eye's `pos` in metres, and the `yaw` it looks along and the `pitch` it looks down by. The
// `player` row stands on the start of its slot. It has no rule and is not drawn.
import type { Kind } from '#engine/engine.ts'

export const start: Kind = {}
