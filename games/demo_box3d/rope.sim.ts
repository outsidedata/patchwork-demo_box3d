// The pendulum's rope: a distance joint from the gallows' beam, static body 7, to the `bob`, holding it `length` metres off. Its spring and limit are its entry in `world.box3d.joints.rope`.
// A joint of box3d: its row's `ends` name its two bodies, and the game's bodies plugin's `tie` writes
// their ids into `a` and `b` each step. box3d writes what it measures into `measured` each step it
// stands.
import type { Kind } from '#engine/engine.ts'
import { tie } from './plugins/bodies/bodies.sim.ts'

export const rope: Kind = { before: tie }
