// The readings of a hinge: the hinge's angle in degrees and its motor's torque, then the force and
// torque that hold it, from its row's `measured` (box3d), shown on the ui panel its definition
// names (`panel`, `assets/demo_box3d.json`) in the scene's ui style `style`, `above` metres over
// its body `b`, through the game's bodies plugin. Nothing shows before box3d has made the joint.
// The joint itself is not drawn: its bodies are.
import type { Row } from '#engine/engine.ts'
import type { Plugins } from '#engine/browser.ts'
import { def } from '#plugins/loader/loader.sim.ts'

const len = (v: number[]) => Math.hypot(v[0], v[1], v[2])

export function setup() {}

export function tick(row: Row, plugins: Plugins) {
  const m = row.data.measured
  const body = plugins.wire.rows.find(r => r.id === row.data.b)
  if (!m || !body) return
  const k = def(plugins.wire, row.kind)
  const at = [body.data.pos[0], body.data.pos[1] + k.above, body.data.pos[2]]
  const lines = [
    `hinge  ${(m.angle * 180 / Math.PI).toFixed(1)}°  motor ${m.motorTorque.toFixed(1)} N·m`,
    `force ${len(m.constraintForce).toFixed(0)} N  torque ${len(m.constraintTorque).toFixed(0)} N·m`,
  ]
  plugins.bodies.label(plugins, k.panel, `${row.kind} ${row.id}`, at, lines.join('\n'), k.style)
}

export function remove() {}
