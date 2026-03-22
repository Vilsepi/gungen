
# Rendering Terminology and Coordinate System

This document defines the canonical terminology for directions, weapon parts, and attachment
points used throughout the codebase. All new code and documentation should use these terms
consistently.

## SVG Coordinate System

SVG uses a standard screen coordinate system:

- The **origin (0, 0)** is at the **top-left** corner of the canvas.
- The **X axis** increases to the **right**.
- The **Y axis** increases **downward** (opposite to school mathematics).

## Weapon Orientation

All weapons are rendered so that they **point to the left**. Flipping a weapon to point in the
opposite direction should require only a single boolean toggle with no other code change.

This orientation defines the following directional terms as they appear on screen:

| Term          | Aliases        | Screen X    | Screen Y    | Description                                    |
| ------------- | -------------- | ----------- | ----------- | ---------------------------------------------- |
| **FORWARD**   | fore, front    | decreasing  |             | Toward the muzzle end of the weapon (left)     |
| **REARWARD**  | rear, back     | increasing  |             | Toward the stock or butt end of the weapon (right) |
| **UP**        | upper, top     |             | decreasing  | Toward the top of the weapon                   |
| **DOWN**      | lower, bottom  |             | increasing  | Toward the underside of the weapon             |

## Internal Layout Coordinate System

Internally, layout positions are computed in a **right-facing coordinate system** to keep
forward movement in the natural positive-X direction. This is simpler to reason about during
layout math.

- **Positive X** is the FORWARD direction (toward the muzzle).
- **Negative X** is the REARWARD direction (toward the stock).
- **Negative Y** is UP.
- **Positive Y** is DOWN.

The final SVG document applies a horizontal mirror transform (`scale(-1 1)`) that flips the
drawing so the weapon faces left on screen. All part positions and anchors in layout code use
this internal right-facing system.

## Part Terminology

### Core Parts

| Term            | Description |
| --------------- | ----------- |
| **Receiver**    | The main structural body of the firearm. All other parts attach to it directly or indirectly. Also called the lower, frame, or action body. |
| **Barrel**      | The tube through which the projectile travels. Has a **breech end** (rear, attaches to receiver) and a **muzzle end** (forward, where the projectile exits). |
| **Magwell**     | The magazine well housing attached below the receiver. Guides and retains the magazine. |
| **Magazine**    | The detachable ammunition container that feeds rounds into the weapon from below the magwell. |
| **Pistol Grip** | The vertical grip below the receiver used to hold the weapon. |

### Optional Parts

| Term               | Description |
| ------------------ | ----------- |
| **Stock**          | The buttstock extending rearward from the receiver. The rearmost part contacts the shooter's shoulder. Also called a buttstock. |
| **Handguard**      | The protective housing forward of the receiver that surrounds the barrel. Also called a forend or forestock. Provides mounting rails for accessories. |
| **Optic**          | A scope, red dot, holographic sight, or other aiming device mounted on top of the receiver. |
| **Muzzle Device**  | A device threaded onto the muzzle end of the barrel. Examples include flash hiders, compensators, muzzle brakes, and suppressors. |
| **Front Grip**     | A secondary vertical grip mounted on the handguard's underside. Also called a foregrip or vertical foregrip. |
| **Laser**          | A laser aiming module attached to the handguard or receiver. |
| **Flashlight**     | A tactical illumination device attached to the handguard or receiver. |

## Attachment Point Terminology

Attachment points are named anchors on a part that can connect to anchors on another part.
The `id` of an attachment point is a descriptive local name on the part. The `kind` classifies
the directional or functional role of the point.

### Canonical Attachment Point Kinds

| Kind            | Direction      | Description |
| --------------- | -------------- | ----------- |
| `front`         | Forward (+X)   | A forward-facing connection surface (e.g. receiver's front face). |
| `rear`          | Rearward (−X)  | A rearward-facing connection surface. **Use `rear` exclusively. Do not use `back` as a synonym.** |
| `top`           | Up (−Y)        | A connection surface on the upper side of the part. |
| `bottom`        | Down (+Y)      | A connection surface on the lower side of the part. |
| `side`          | Lateral        | A side-facing connection surface. |
| `barrelStart`   | Rearward (−X)  | The breech end of a barrel (the rear end that connects to the receiver or handguard). |
| `barrelEnd`     | Forward (+X)   | The muzzle end of a barrel (the forward end that connects to a muzzle device). |
| `magIn`         | Up (−Y)        | The top of a magazine where rounds feed into the magwell. |
| `magOut`        | Down (+Y)      | The bottom opening of the magwell that accepts a magazine. |

### Attachment Point Naming Rules

- Prefer directional names over arbitrary labels when naming attachment point `id` fields.
- Use `front` and `rear` for any forward- or rearward-facing mounts (not `start`/`end`/`back`).
- Use `top` and `bottom` for vertical mounts.
- Use `mount` only as a generic `id` when a part has a single obvious mounting point with no
  directional ambiguity (e.g. a muzzle device's single rear mount, or an optic's single
  bottom mount).
- The `kind` field must use one of the canonical values listed above.
