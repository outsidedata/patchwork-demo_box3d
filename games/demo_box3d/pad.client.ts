// The look of the sensor pad: its shape in `world.box3d.kinds.pad`, drawn by the game's bodies plugin
// in its definition's paint (`assets/demo_box3d.json`). While its row has `visitors`, something is
// inside it, and it glows its definition's `lit` colour at `glow` times; with none, it glows nothing.
import type * as THREE from 'three'
import type { Row } from '#engine/engine.ts'
import type { Plugins } from '#engine/browser.ts'
import { def } from '#plugins/loader/loader.sim.ts'

let id = 0
let materials: THREE.MeshStandardMaterial[] = []

export function setup() {}

export function tick(row: Row, plugins: Plugins) {
  const k = def(plugins.wire, row.kind)
  if (!id) {
    id = row.id
    const group = plugins.bodies.draw(plugins, row.id, plugins.wire.scene.world!.box3d.kinds[row.kind].shapes, k) as THREE.Group
    materials = group.children.map(m => (m as THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial>).material)
    for (const m of materials) m.emissive.set(k.lit)
  }
  const inside = (row.data.visitors?.length ?? 0) > 0
  for (const m of materials) m.emissiveIntensity = inside ? k.glow : 0
}

export function remove(plugins: Plugins) {
  if (id) plugins.bodies.undraw(plugins, id)
}
