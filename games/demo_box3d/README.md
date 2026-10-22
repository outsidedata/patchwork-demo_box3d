# demo_box3d

box3d's rigid bodies in a walled arena lit by environment3d: a crate pile, a barrel stack, a block
tower and balls rolling down a ramp to knock over; one body of every shape (box, sphere, capsule,
hull, cylinder, cone, rock); a door on a revolute hinge, a pendulum on a distance joint, a plank on a
sprung wheel joint and a welded chain, each with its joint readings over it; a one-way platform and
a pad that lights while something is in it. The world is `world.box3d` in `main.scene.json`, and the
kinds' numbers are in `assets/demo_box3d.json`.

## Playing it

`yarn vite`, then `/games/demo_box3d/dev.html`, the demo: three's stats panel at the top left, and
box3d's panel at the right with the world's settings, the bodies' materials, the joints, the blast,
copy JSON, reset to the file and a render3d folder. `/games/demo_box3d/index.html` is the game as it
ships. Its server is `node --experimental-strip-types games/demo_box3d/demo_box3d.server.ts`, then
`/games/demo_box3d/client.html`.

| Key | What it does |
| --- | --- |
| WASD, Space / C, Shift | fly, rise and sink, faster |
| mouse (click to lock), right-drag | look |
| wheel | fly pace |
| F | fire a ball |
| X | an explosion where the eye looks |

Every key and number of the eye is in `assets/demo_box3d.json`.

## The art

None: every shape is drawn from its collision shape, so there is nothing to bake.
