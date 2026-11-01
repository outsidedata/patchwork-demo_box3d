// The playtester the benchmark plays the arena with (`--playtest`, benchmarking-a-game): the seat flies
// its eye from one body to the next, turning to face it, firing shots at it on the way in and blowing it
// apart once it is close, then picks the nearest other body, so the arena is measured with its bodies
// flying, shots in the air and blasts going off, as a player plays it, and not sitting still.
// Each frame the think reads the rows the page holds and names one of the player's acts
// (`player.sim.ts`): a `look` to turn the eye toward the body, a `stick` to fly at it, a `fire`, or a
// `blast` when it is near.
import type { Row } from '#engine/engine.ts'
import type { Think } from '#plugins/playtester/playtester.plugin.ts'

// the kinds of body it goes after
const BODIES = new Set(['crate', 'barrel', 'block', 'ball', 'box', 'sphere', 'cylinder', 'cone', 'capsule', 'rock', 'plank', 'hull'])
// metres from the body at which it stops flying in and blasts it
const NEAR = 7
// the most it turns its eye in one frame, radians
const TURN = 0.08

const wrap = (a: number) => a - 2 * Math.PI * Math.ceil((a - Math.PI) / (2 * Math.PI))

function arena(): Think {
  let target: number | undefined
  let frame = 0
  let blasted = 0
  let stick = ''
  return (rows: Row[]) => {
    frame++
    const me = rows.find(r => r.kind === 'player' && r.data.mine === true)
    if (!me || !me.data.stood) return undefined
    const at = me.data.pos as number[]
    const bodies = rows.filter(r => BODIES.has(r.kind) && Array.isArray(r.data.pos))
    const far = (r: Row) => Math.hypot(r.data.pos[0] - at[0], r.data.pos[1] - at[1], r.data.pos[2] - at[2])
    let it = bodies.find(r => r.id === target)
    if (!it) {
      it = bodies.filter(r => r.id !== blasted).sort((a, b) => far(a) - far(b))[0]
      target = it?.id
    }
    if (!it) return undefined
    const [dx, dy, dz] = [0, 1, 2].map(i => it.data.pos[i] - at[i])
    const yaw = Math.atan2(dx, dz), pitch = Math.atan2(-dy, Math.hypot(dx, dz))
    const dyaw = wrap(yaw - me.data.look.yaw), dpitch = pitch - me.data.look.pitch
    const facing = Math.abs(dyaw) < 0.2 && Math.abs(dpitch) < 0.2
    const close = far(it) < NEAR
    // one act a frame: turn while not facing it, else fly, fire and blast by turns
    if (!facing) return ['look', Math.max(-TURN, Math.min(TURN, dyaw)), Math.max(-TURN, Math.min(TURN, dpitch))]
    const want = close ? '0,0' : '0,-1'
    if (want !== stick) { stick = want; return ['stick', 0, close ? 0 : -1] }
    if (close) { blasted = it.id; target = undefined; return ['blast'] }
    return frame % 6 === 0 ? ['fire'] : undefined
  }
}

export const playtest: Record<string, Think> = { main: arena() }
