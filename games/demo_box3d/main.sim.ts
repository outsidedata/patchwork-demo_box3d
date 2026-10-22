// The kinds of main and the main.scene.json file next to this one: box3d's world row, the arena of
// static bodies, the shape gallery (box, sphere, capsule, hull, cylinder, cone, rock), the crates,
// barrels, balls and tower blocks to knock over, the jointed door, pendulum bob, sprung plank and
// welded chain links with their joints (hinge, rope, spring, weld), the sensor pad, the shots the eye
// fires and the blasts it sets off, and the seat's eye. Every number of them that never changes is
// box3d's `world.box3d` in the scene file or its definition in `assets/demo_box3d.json`, which the
// scene's `world.defs` names. Where each seat's eye starts is a `start` actor of the scene file, one
// per slot.
import type { Scene, Sim } from '#engine/engine.ts'
import { scenemanager } from '#plugins/scenemanager/scenemanager.sim.ts'
import { loader } from '#plugins/loader/loader.sim.ts'
import { box3d } from '#plugins/box3d/box3d.sim.ts'
import { player } from './player.sim.ts'
import { start } from './start.sim.ts'
import { arena } from './arena.sim.ts'
import { pad } from './pad.sim.ts'
import { box } from './box.sim.ts'
import { sphere } from './sphere.sim.ts'
import { capsule } from './capsule.sim.ts'
import { hull } from './hull.sim.ts'
import { cylinder } from './cylinder.sim.ts'
import { cone } from './cone.sim.ts'
import { rock } from './rock.sim.ts'
import { crate } from './crate.sim.ts'
import { barrel } from './barrel.sim.ts'
import { ball } from './ball.sim.ts'
import { block } from './block.sim.ts'
import { door } from './door.sim.ts'
import { bob } from './bob.sim.ts'
import { plank } from './plank.sim.ts'
import { link } from './link.sim.ts'
import { shot } from './shot.sim.ts'
import { hinge } from './hinge.sim.ts'
import { rope } from './rope.sim.ts'
import { spring } from './spring.sim.ts'
import { weld } from './weld.sim.ts'
import { blast } from './blast.sim.ts'
import file from './main.scene.json' with { type: 'json' }

export const sim: Sim = {
  scenemanager, loader, box3d, player, start, arena, pad,
  box, sphere, capsule, hull, cylinder, cone, rock,
  crate, barrel, ball, block, door, bob, plank, link, shot,
  hinge, rope, spring, weld, blast,
}

export const scene = file as Scene
