// The plank's spring: a wheel joint from the pedestal, static body 8, to the `plank`, its suspension the spring the plank bobs on, along the frames' x, which the frames turn upright, and its spin the axle the plank tips about. Its spring, limits and motor are its entry in `world.box3d.joints.spring`.
// A joint of box3d: its row's `ends` name its two bodies, and the game's bodies plugin's `tie` writes
// their ids into `a` and `b` each step. box3d writes what it measures into `measured` each step it
// stands.
import type { Kind } from '#engine/engine.ts'
import { tie } from './plugins/bodies/bodies.sim.ts'

export const spring: Kind = { before: tie }
