// A weld of the chain: from the chain's post, static body 9, or a `link` to the next `link`, held at `linearHertz` and `angularHertz` (0, rigid), so the chain bends as a soft rod. Its entry is `world.box3d.joints.weld`; the first weld's row gives its own `localFrameA` on the post.
// A joint of box3d: its row's `ends` name its two bodies, and the game's bodies plugin's `tie` writes
// their ids into `a` and `b` each step. box3d writes what it measures into `measured` each step it
// stands.
import type { Kind } from '#engine/engine.ts'
import { tie } from './plugins/bodies/bodies.sim.ts'

export const weld: Kind = { before: tie }
