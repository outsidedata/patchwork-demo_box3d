// The look of the arena: every static body of `world.box3d.static`, drawn by the game's bodies
// plugin where it stands, static body i in its definition's `paint[i]` (`assets/demo_box3d.json`),
// with the definition's `roughness` and `metalness`; and a grid of `grid.cells` lines a side over
// `grid.size` metres, in `grid.colour`, `grid.lift` metres over the floor, so a thing's speed and
// size read against the ground. It is drawn on its first tick, once the game's plugins are loaded.
import type * as THREE from 'three'
import type { Row } from '#engine/engine.ts'
import type { Plugins } from '#engine/browser.ts'
import type { Static } from '#plugins/box3d/box3d.sim.ts'
import { def } from '#plugins/loader/loader.sim.ts'

let groups: THREE.Group[] = []
let grid: THREE.GridHelper | undefined

export function setup() {}

export function tick(row: Row, plugins: Plugins) {
  if (grid) return
  const three = plugins.render3d.THREE as typeof THREE
  const k = def(plugins.wire, row.kind)
  const statics: Static[] = plugins.wire.scene.world!.box3d.static
  if (k.paint.length !== statics.length) throw new Error(`arena: ${k.paint.length} paints for ${statics.length} static bodies`)
  groups = statics.map((s, i) => {
    const group = plugins.bodies.build(plugins, s.shapes, { colour: k.paint[i], roughness: k.roughness, metalness: k.metalness }) as THREE.Group
    group.position.fromArray(s.pos)
    group.quaternion.fromArray(s.rot)
    plugins.render3d.scene.add(group)
    return group
  })
  grid = new three.GridHelper(k.grid.size, k.grid.cells, k.grid.colour, k.grid.colour)
  grid.position.y = k.grid.lift
  plugins.render3d.scene.add(grid)
}

export function remove(plugins: Plugins) {
  for (const group of groups) {
    plugins.render3d.scene.remove(group)
    plugins.bodies.dispose(group)
  }
  groups = []
  if (grid) {
    plugins.render3d.scene.remove(grid)
    grid.geometry.dispose()
    ;(grid.material as THREE.Material).dispose()
    grid = undefined
  }
}
