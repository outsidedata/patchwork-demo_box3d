// Where an explosion went off, to be seen: the `blast` act of the `player` row spawns one at the point
// it asked box3d to `explode`. Its row is `pos` and `age`, the seconds since; each step adds the
// step's seconds, and the step its age passes its definition's `life` (`assets/demo_box3d.json`) ends
// it. The explosion itself is box3d's, on the step after the act.
import type { Kind } from '#engine/engine.ts'
import { def } from '#plugins/loader/loader.sim.ts'

export const blast: Kind = {
  tick(me, dt, w) {
    me.data.age += dt
    if (me.data.age > def(w, me.kind).life) w.end(me)
  },
}
