// The server half of the game's bodies plugin: what every joint kind of the game (hinge, rope, spring,
// weld) shares. It has no row, no numbers and no browser state; the browser half is
// `bodies.plugin.ts`.
//
// `tie` is a joint kind's `before`. A joint row names its two bodies in `ends`, each either a number,
// static body i of `world.box3d.static` as box3d names it, -(i + 1), or `[kind, name]`, the row of
// that kind whose `name` (the Body field box3d gives Box3D) is that name. Each step it writes the two
// row ids into the row's `a` and `b`, which box3d ties the joint between. So the scene file names a
// joint's bodies by what they are rather than by where they stand in `actors`, and a body put back
// as a new row of the same name (the testbed does, to give it new numbers) is tied again on the next
// step. A name no row of the kind carries throws.
import type { Row, W } from '#engine/engine.ts'

export type End = number | [kind: string, name: string]

const idOf = (me: Row, w: W, end: End): number => {
  if (typeof end === 'number') return end
  const [kind, name] = end
  const row = w.all(kind).find(r => r.data.name === name)
  if (!row) throw new Error(`${me.kind} ${me.id}: no ${kind} is named ${name}`)
  return row.id
}

export function tie(me: Row, _dt: number, w: W) {
  const [a, b] = me.data.ends as [End, End]
  me.data.a = idOf(me, w, a)
  me.data.b = idOf(me, w, b)
}
