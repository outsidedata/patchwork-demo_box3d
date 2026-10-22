// The arena: what never moves, the bodies of `world.box3d.static` (the floor, its four walls, the
// door's post, the gallows' post and beam, the plank's pedestal, the chain's post, the ramp and the
// one-way platform), which box3d places once when it makes the world and which no row carries. One
// `actors` entry, so its look draws them. It has no rule.
import type { Kind } from '#engine/engine.ts'

export const arena: Kind = {}
