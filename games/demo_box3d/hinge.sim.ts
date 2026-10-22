// The door's hinge: a revolute joint from the door's post, static body 5, to the `door`, turning about the frames' z, which the frames turn upright. Its limit, spring and motor are its entry in `world.box3d.joints.hinge`.
// A joint of box3d: its row's `ends` name its two bodies, and the game's bodies plugin's `tie` writes
// their ids into `a` and `b` each step. box3d writes what it measures into `measured` each step it
// stands.
import type { Kind } from '#engine/engine.ts'
import { tie } from './plugins/bodies/bodies.sim.ts'

export const hinge: Kind = { before: tie }
