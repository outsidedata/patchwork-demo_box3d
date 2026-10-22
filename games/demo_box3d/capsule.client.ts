// The look of a capsule: its kind's shapes in `world.box3d.kinds.capsule`, drawn by the game's bodies plugin
// in its definition's paint (`assets/demo_box3d.json`), the group following its row through box3d.
// It is drawn on its first tick, once the game's plugins are loaded (`shipped`).
import type { Row } from '#engine/engine.ts'
import type { Plugins } from '#engine/browser.ts'
import { def } from '#plugins/loader/loader.sim.ts'

let id = 0

export function setup() {}

export function tick(row: Row, plugins: Plugins) {
  if (id) return
  id = row.id
  plugins.bodies.draw(plugins, row.id, plugins.wire.scene.world!.box3d.kinds[row.kind].shapes, def(plugins.wire, row.kind))
}

export function remove(plugins: Plugins) {
  if (id) plugins.bodies.undraw(plugins, id)
}
