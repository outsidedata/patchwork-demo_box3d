// The row one seat possesses, and the eye that seat flies over the arena: a point the camera sits on
// (chasecamera3d, `dist` metres behind it), turned by the mouse and flown by the keys. `addons/player`
// spawns it and writes the slot it gave the connection into `seat`, and every seat is sent it. Every
// number is the player's definition in `assets/demo_box3d.json`, and the blast's in its own.
//
// The row: `seat`, and `stood`, whether it stands yet. Its own:
//   pos       [x, y, z], the eye, in metres.
//   look      `{ yaw, pitch, dist }`: chasecamera3d's orbit; the eye looks along yaw and down by pitch.
//   lift      0: the camera's pivot is the eye itself.
//   stick     [x, z], the keys' way, right and forward; `up` and `down`, the climb keys held; `fast`,
//             the boost key held.
//   pace      the fly speed's multiplier, which the wheel moves, from `pace.min` to `pace.max`.
//
// `before` stands it once on the scene's `start` actor for its slot, at the start's `pos`, looking
// along its `yaw` and down by its `pitch`. Each step after, it flies `speed`·pace metres a second
// along the way it looks, forward and back, and across it, level, right and left, and `climb`·pace
// straight up or down; all of it `boost` times faster while `fast` is held. It never comes nearer
// than `clear` metres to the arena's floor, y = 0, nor goes higher than `ceiling`.
//
// The acts are the page's keys: `stick(x, y)` (y down, as a stick reads), `up`, `down` and `fast` (1
// held, 0 let go), `pace(d)` the wheel, `look(dyaw, dpitch)`, and two that act on the world:
//   fire    a `shot` from the eye: spawned `fire.muzzle` metres out along the way the eye looks, moving
//           that way at `fire.speed` m/s.
//   blast   an explosion where the eye looks: the first thing a ray from the eye meets within the
//           blast's `reach` metres (box3d's `castRayClosest`), or the point `reach` out when it meets
//           nothing. The scene's `box3d` row is asked to `explode` there with the blast's `radius`,
//           `falloff` and `impulse` (per area), and a `blast` row is spawned there to be seen.
// A seat's message arrives from outside the program, so each act refuses arguments of the wrong kind
// and writes nothing.
import type { Kind, Row, W } from '#engine/engine.ts'
import { def } from '#plugins/loader/loader.sim.ts'
import { castRayClosest } from '#plugins/box3d/box3d.sim.ts'
import * as math from '#plugins/math/math.sim.ts'

const wrap = (a: number) => a - 2 * Math.PI * Math.ceil((a - Math.PI) / (2 * Math.PI))
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))
const finite = (...v: unknown[]) => v.every(x => typeof x === 'number' && Number.isFinite(x))
const held = (v: unknown) => v === 0 || v === 1
const way = (v: unknown) => typeof v === 'number' && Math.abs(v) <= 1

// The way the eye looks, a unit vector: along yaw, down by pitch.
function forwardOf(d: any): [number, number, number] {
  const { yaw, pitch } = d.look
  const cp = math.cos(pitch)
  return [math.sin(yaw) * cp, -math.sin(pitch), math.cos(yaw) * cp]
}

function fly(me: Row, w: W, dt: number) {
  const d = me.data
  const k = def(w, me.kind)
  const forward = forwardOf(d)
  const right = [-math.cos(d.look.yaw), 0, math.sin(d.look.yaw)]
  const boost = d.fast ? k.boost : 1
  const run = k.speed * d.pace * boost, rise = k.climb * d.pace * boost * ((d.up ? 1 : 0) - (d.down ? 1 : 0))
  const [sx, sz] = d.stick
  const x = d.pos[0] + (forward[0] * sz + right[0] * sx) * run * dt
  const z = d.pos[2] + (forward[2] * sz + right[2] * sx) * run * dt
  const y = d.pos[1] + (forward[1] * sz * run + rise) * dt
  d.pos = [x, clamp(y, k.clear, k.ceiling), z]
}

export const player: Kind = {
  before(me, _dt, w) {
    const d = me.data
    if (d.stood) return
    const start = w.find('start', s => s.data.slot === d.seat).data
    d.pos = [...start.pos]
    d.look = { ...d.look, yaw: start.yaw, pitch: start.pitch }
    d.stood = true
  },
  tick(me, dt, w) {
    if (me.data.stood) fly(me, w, dt)
  },
  acts: {
    stick(me, _w, _seat, x: unknown, y: unknown) {
      if (way(x) && way(y)) me.data.stick = [x, 0 - (y as number)]
    },
    up(me, _w, _seat, v: unknown) { if (held(v)) me.data.up = !!v },
    down(me, _w, _seat, v: unknown) { if (held(v)) me.data.down = !!v },
    fast(me, _w, _seat, v: unknown) { if (held(v)) me.data.fast = !!v },
    pace(me, w, _seat, by: unknown) {
      if (!finite(by)) return
      const p = def(w, me.kind).pace
      me.data.pace = clamp(me.data.pace * math.exp(-(by as number) * p.step), p.min, p.max)
    },
    look(me, w, _seat, dyaw: unknown, dpitch: unknown) {
      if (!finite(dyaw, dpitch)) return
      const c = def(w, me.kind).camera
      const l = me.data.look
      me.data.look = { ...l, yaw: wrap(l.yaw + (dyaw as number)), pitch: clamp(l.pitch + (dpitch as number), c.minPitch, c.maxPitch) }
    },
    fire(me, w) {
      const d = me.data
      if (!d.stood) return
      const { speed, muzzle } = def(w, me.kind).fire
      const f = forwardOf(d)
      w.spawn('shot', {
        pos: [d.pos[0] + f[0] * muzzle, d.pos[1] + f[1] * muzzle, d.pos[2] + f[2] * muzzle],
        vel: [f[0] * speed, f[1] * speed, f[2] * speed],
      })
    },
    blast(me, w, seat) {
      const d = me.data
      if (!d.stood) return
      const b = def(w, 'blast')
      const f = forwardOf(d)
      const hit = castRayClosest(w, [d.pos[0], d.pos[1], d.pos[2]], [f[0] * b.reach, f[1] * b.reach, f[2] * b.reach])
      const at = hit ? hit.point : [d.pos[0] + f[0] * b.reach, d.pos[1] + f[1] * b.reach, d.pos[2] + f[2] * b.reach]
      w.call(w.find('box3d'), 'explode', seat, at[0], at[1], at[2], b.radius, b.falloff, b.impulse)
      w.spawn('blast', { pos: [at[0], at[1], at[2]] })
    },
  },
}
