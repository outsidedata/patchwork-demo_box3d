// The sensor pad at the foot of the ramp: a static body whose one shape is a sensor
// (`world.box3d.kinds.pad`, `isSensor` and `enableSensorEvents`), so nothing stands on it and things
// pass into it, and box3d writes the bodies inside it into its row's `visitors` each step, sorted,
// and takes the field off while none is. Every dynamic shape of the scene has its own
// `enableSensorEvents`, which Box3D asks of a visitor. It has no rule of its own.
import type { Kind } from '#engine/engine.ts'

export const pad: Kind = {}
