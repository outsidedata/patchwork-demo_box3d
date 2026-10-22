// The browser half of the game's bodies plugin: how every body of the demo is drawn, and how a joint
// shows what it measures. It has no row and no numbers of its own: a look hands it a body's Box3D
// shapes, which the look reads off the scene's `world.box3d` (a kind's `shapes`, or a static's), and
// the paint of its kind's definition in `assets/demo_box3d.json`. The server half is `bodies.sim.ts`.
//
// `build(plugins, shapes, paint)` makes one three.js group of a mesh per shape, each shape drawn as
// Box3D holds it: a box as a box of its half extents, a sphere and a capsule as themselves, and a
// hull, a cylinder, a cone and a rock as the convex hull of the vertices Box3D gives that hull
// (`b3GetHullVertices`), so a cylinder of 24 sides is drawn with its 24 flat sides and a rock is the
// very rock Box3D collides. A shape's `pos`, `rot` and `scale` place its mesh in the body as Box3D
// places the hull. Every material is one MeshStandardMaterial of the paint's `colour`, `roughness`
// and `metalness`, dressed by render3d, and every mesh casts and takes shadows. A mesh, height field
// or compound shape throws: no body of the game has one.
//
// `draw(plugins, id, shapes, paint)` builds a row's group, puts it on render3d's scene, and has box3d
// follow the row with it, so it stands where the row's `pos` and `rot` say every frame; it hands the
// group back. `undraw(plugins, id)` stops following it, takes it off the scene and disposes it.
//
// `label(plugins, panel, key, at, text, style)` shows `text` on the ui panel `panel`, in the scene's
// ui style `style`, centred over the world point `at`, every frame the look asks for it (the ui's
// `show` and `pin`), and nothing on a frame it does not.
//
// One of these per client: the groups it drew are this scene's, and `close` forgets them.
import type * as THREE from 'three'
import { ConvexGeometry } from 'three/addons/geometries/ConvexGeometry.js'
import type { Plugins } from '#engine/browser.ts'
import { b3, type Shape } from '#plugins/box3d/box3d.sim.ts'

export type Paint = { colour: string; roughness: number; metalness: number }

// The vertices of the hull Box3D makes of a hull-shaped geometry, as flat [x, y, z, …].
function hullVertices(s: Shape): number[] {
  const hull = 'hull' in s ? b3.b3CreateHull(s.hull.points)
    : 'cylinder' in s ? b3.b3CreateCylinder(s.cylinder.height, s.cylinder.radius, s.cylinder.yOffset, s.cylinder.sides)
    : 'cone' in s ? b3.b3CreateCone(s.cone.height, s.cone.radius1, s.cone.radius2, s.cone.slices)
    : 'rock' in s ? b3.b3CreateRock(s.rock.radius)
    : undefined
  if (!hull) throw new Error(`bodies: Box3D made no hull of ${JSON.stringify(s)}`)
  const flat = [...b3.b3GetHullVertices(hull)] as number[]
  b3.b3DestroyHull(hull)
  return flat
}

function geometryOf(three: typeof THREE, s: Shape): { geometry: THREE.BufferGeometry; at?: number[]; turn?: number[]; size?: number[] } {
  if ('box' in s) {
    const [x, y, z] = s.box
    return { geometry: new three.BoxGeometry(2 * x, 2 * y, 2 * z), at: s.pos, turn: s.rot, size: s.scale }
  }
  if ('sphere' in s) return { geometry: new three.SphereGeometry(s.sphere.radius, 32, 16), at: s.sphere.center }
  if ('capsule' in s) {
    const { center1: a, center2: b, radius } = s.capsule
    const along = new three.Vector3(b[0] - a[0], b[1] - a[1], b[2] - a[2])
    const length = along.length()
    const turn = length > 0 ? new three.Quaternion().setFromUnitVectors(new three.Vector3(0, 1, 0), along.normalize()) : new three.Quaternion()
    return { geometry: new three.CapsuleGeometry(radius, length, 12, 24), at: [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2], turn: turn.toArray() }
  }
  if ('hull' in s || 'cylinder' in s || 'cone' in s || 'rock' in s) {
    const flat = hullVertices(s)
    const points: THREE.Vector3[] = []
    for (let k = 0; k + 2 < flat.length; k += 3) points.push(new three.Vector3(flat[k], flat[k + 1], flat[k + 2]))
    return { geometry: new ConvexGeometry(points), at: s.pos, turn: s.rot, size: s.scale }
  }
  throw new Error(`bodies draws boxes, spheres, capsules and hulls, and no ${Object.keys(s).find(k => ['mesh', 'heightField', 'compound'].includes(k))}`)
}

export function bodies() {
  const drawn = new Map<number, THREE.Group>()

  const dispose = (group: THREE.Group) => {
    group.traverse(o => {
      const mesh = o as THREE.Mesh<THREE.BufferGeometry, THREE.Material>
      if (!mesh.isMesh) return
      mesh.geometry.dispose()
      mesh.material.dispose()
    })
  }

  const build = (plugins: Plugins, shapes: Shape[], paint: Paint): THREE.Group => {
    const three = plugins.render3d.THREE as typeof THREE
    const group = new three.Group()
    for (const s of shapes) {
      const { geometry, at, turn, size } = geometryOf(three, s)
      const material = plugins.render3d.dress(new three.MeshStandardMaterial({ color: paint.colour, roughness: paint.roughness, metalness: paint.metalness }))
      const mesh = new three.Mesh(geometry, material)
      if (at) mesh.position.fromArray(at)
      if (turn) mesh.quaternion.fromArray(turn)
      if (size) mesh.scale.fromArray(size)
      mesh.castShadow = true
      mesh.receiveShadow = true
      group.add(mesh)
    }
    return group
  }

  return {
    build,
    draw(plugins: Plugins, id: number, shapes: Shape[], paint: Paint): THREE.Group {
      const group = build(plugins, shapes, paint)
      plugins.render3d.scene.add(group)
      plugins.box3d.follow(id, group)
      drawn.set(id, group)
      return group
    },
    undraw(plugins: Plugins, id: number) {
      const group = drawn.get(id)
      if (!group) return
      plugins.box3d.drop(id)
      plugins.render3d.scene.remove(group)
      dispose(group)
      drawn.delete(id)
    },
    dispose,
    label(plugins: Plugins, panel: string, key: string, at: number[], text: string, style: string) {
      const { ui } = plugins
      const t = ui.show(panel, key, () => {
        const made = new ui.PIXI.Text({ text: '', style: ui.style(style) })
        made.anchor.set(0.5, 1)
        return made
      }) as InstanceType<typeof ui.PIXI.Text>
      t.text = text
      ui.pin(t, at)
    },
    close() { drawn.clear() },
  }
}
