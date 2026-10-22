// A ball the eye fires (`fire`, `player.sim.ts`): a bullet, so continuous collision keeps it from
// passing through what it meets. A body of box3d: its kind's Body is `world.box3d.kinds.shot` in the
// scene file, and box3d moves its row (`pos`, `rot`, `vel`, `spin`, `awake`). A shot that leaves the
// arena over its walls falls for ever, so the step it is below its definition's `lost` metres
// (`assets/demo_box3d.json`) ends it.
import type { Kind } from '#engine/engine.ts'
import { def } from '#plugins/loader/loader.sim.ts'

export const shot: Kind = {
  tick(me, _dt, w) {
    if (me.data.pos[1] < def(w, me.kind).lost) w.end(me)
  },
}
