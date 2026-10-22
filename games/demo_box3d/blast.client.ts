// The look of an explosion: a ball of its definition's `colour` (`assets/demo_box3d.json`) on its
// row's `pos`, glowing `glow` times that colour, which grows from nothing to the blast's `radius` as
// its row's `age` goes to its `life`, and fades from `opacity` to nothing as it grows. It casts no
// shadow: it is light.
import type * as THREE from 'three'
import type { Row } from '#engine/engine.ts'
import type { Plugins } from '#engine/browser.ts'
import { def } from '#plugins/loader/loader.sim.ts'

let ball: THREE.Mesh<THREE.SphereGeometry, THREE.MeshStandardMaterial>

export function setup(row: Row, plugins: Plugins) {
  const three = plugins.render3d.THREE as typeof THREE
  const k = def(plugins.wire, row.kind)
  const material = plugins.render3d.dress(new three.MeshStandardMaterial({ color: k.colour, emissive: k.colour, emissiveIntensity: k.glow, transparent: true, depthWrite: false }))
  ball = new three.Mesh(new three.SphereGeometry(1, k.segments, k.segments / 2), material)
  plugins.render3d.scene.add(ball)
  tick(row, plugins)
}

export function tick(row: Row, plugins: Plugins) {
  const k = def(plugins.wire, row.kind)
  const t = Math.min(row.data.age / k.life, 1)
  ball.position.fromArray(row.data.pos)
  ball.scale.setScalar(Math.max(t, 0.001) * k.radius)
  ball.material.opacity = k.opacity * (1 - t)
}

export function remove(plugins: Plugins) {
  plugins.render3d.scene.remove(ball)
  ball.geometry.dispose()
  ball.material.dispose()
}
