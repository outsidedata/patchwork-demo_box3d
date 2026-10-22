// demo_box3d, played as a seat plays it: the manager booted as its page boots it and main loaded; the
// eye flies on the stick, a ball fired at a crate knocks it away, and a blast where the eye looks
// throws what is there.
import { expect, test } from 'vitest'
import { boot, type Scene } from '#engine/engine.ts'
import { connection, load, manager, type Down } from '#addons/scenemanager/scenemanager.addon.ts'
import { sim } from './demo_box3d.sim.ts'
import file from './demo_box3d.scene.json' with { type: 'json' }

const DT = file.prefabs.engine.dt
const len = (v: number[]) => Math.hypot(...v)
const sub = (a: number[], b: number[]) => a.map((c, i) => c - b[i])

async function join() {
  const truth = boot(file as Scene, sim)
  const room = (await load(truth, import.meta.url)).get('main')!
  const heard: Down[] = []
  const seat = connection(manager(truth), d => heard.push(d))
  truth.step(DT)
  let seq = 0
  const send = (action: string, ...args: number[]) => {
    const last = heard[heard.length - 1]
    const me = last.packet.rows.find(r => r.kind === 'player')!
    seat.take({ scene: last.scene, seat: last.seat, msg: { seq: ++seq, n: last.packet.n, id: me.id, action, args } })
  }
  const run = (steps: number) => { for (let i = 0; i < steps; i++) truth.step(DT) }
  const eye = () => room.rows.find(r => r.kind === 'player')!.data
  const crate = () => room.rows.find(r => r.kind === 'crate')!
  return { send, run, eye, crate }
}

test('the eye flies forward on the stick', async () => {
  const { send, run, eye } = await join()
  const was = [...eye().pos]
  send('stick', 0, -1)
  run(60)
  const { yaw } = eye().look
  const moved = sub(eye().pos, was)
  // Forward along the way it looks, level.
  expect(moved[0] * Math.sin(yaw) + moved[2] * Math.cos(yaw)).toBeGreaterThan(1)
})

test('a ball fired at a crate knocks it away', async () => {
  const { send, run, eye, crate } = await join()
  run(30)
  const at = [...crate().data.pos]
  // The eye 6 m back from the crate, level with it, looking square at it.
  eye().pos = [at[0], at[1], at[2] - 6]
  eye().look = { ...eye().look, yaw: 0, pitch: 0 }
  run(1)
  send('fire')
  run(60)
  expect(len(sub(crate().data.pos, at))).toBeGreaterThan(0.3)
})

test('a blast where the eye looks throws the crate there', async () => {
  const { send, run, eye, crate } = await join()
  run(30)
  const at = [...crate().data.pos]
  // The eye over the crate, looking straight down at it.
  eye().pos = [at[0], at[1] + 6, at[2]]
  eye().look = { ...eye().look, pitch: 1.5 }
  run(1)
  send('blast')
  run(30)
  expect(len(sub(crate().data.pos, at))).toBeGreaterThan(0.3)
})
