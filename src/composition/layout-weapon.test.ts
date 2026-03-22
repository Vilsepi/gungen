import { describe, expect, it } from "vitest";

import { partPricePerGramCents } from "../core/constants";
import { LayoutAnchor, LayoutPart } from "../core/types";
import {
  BarrelPart,
  FlashlightPart,
  FrontGripPart,
  HandguardPart,
  LaserPart,
  MagwellPart,
  MagazinePart,
  OpticPart,
  PistolGripPart,
  ReceiverPart,
} from "../domain/parts/factory";
import { layoutWeapon } from "./layout-weapon";

function getPart(layout: LayoutPart[], kind: LayoutPart["kind"]): LayoutPart {
  const part = layout.find((candidate) => candidate.kind === kind);
  if (!part) {
    throw new Error(`Missing ${kind} in test layout.`);
  }
  return part;
}

function resolveAnchor(
  part: LayoutPart,
  anchor: LayoutAnchor,
): {
  x: number;
  y: number;
} {
  const radians = (part.rotationDeg * Math.PI) / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  return {
    x: part.x + anchor.x * cos - anchor.y * sin,
    y: part.y + anchor.x * sin + anchor.y * cos,
  };
}

function getAnchor(part: LayoutPart, name: string): LayoutAnchor {
  const anchor = part.anchors[name];
  if (!anchor) {
    throw new Error(`Missing ${name} anchor for ${part.kind}.`);
  }
  return anchor;
}

describe("layoutWeapon pricing", () => {
  it("sums total price from each part weight and kind multiplier", () => {
    const parts = [
      new ReceiverPart("receiver-test"),
      new BarrelPart("barrel-test"),
      new MagwellPart("magwell-test"),
      new MagazinePart("magazine-test"),
      new PistolGripPart("pistol-grip-test"),
      new OpticPart("optic-test"),
    ];

    const result = layoutWeapon(parts);
    const expectedTotalWeight = parts.reduce(
      (sum, part) => sum + Number(part.weight),
      0,
    );
    const expectedTotalPrice = parts.reduce(
      (sum, part) =>
        sum +
        Math.round(Number(part.weight) * partPricePerGramCents[part.kind]),
      0,
    );

    expect(Number(result.metrics.totalWeight)).toBeCloseTo(
      expectedTotalWeight,
      10,
    );
    expect(Number(result.metrics.totalPrice)).toBe(expectedTotalPrice);
  });

  it("keeps attachments in contact with the receiver or handguard", () => {
    const result = layoutWeapon([
      new ReceiverPart("receiver-test"),
      new BarrelPart("barrel-test"),
      new MagwellPart("magwell-test"),
      new MagazinePart("magazine-test"),
      new PistolGripPart("pistol-grip-test"),
      new HandguardPart("handguard-test"),
      new OpticPart("optic-test"),
      new LaserPart("laser-test"),
      new FlashlightPart("flashlight-test"),
      new FrontGripPart("front-grip-test"),
    ]);

    const receiver = getPart(result.layout, "receiver");
    const handguard = getPart(result.layout, "handguard");
    const optic = getPart(result.layout, "optic");
    const laser = getPart(result.layout, "laser");
    const flashlight = getPart(result.layout, "flashlight");
    const frontGrip = getPart(result.layout, "frontGrip");

    const opticMount = resolveAnchor(optic, getAnchor(optic, "mount"));
    expect(opticMount.y).toBeCloseTo(receiver.y - receiver.width / 2, 10);

    const laserMount = resolveAnchor(laser, getAnchor(laser, "mount"));
    expect(laserMount.y).toBeCloseTo(handguard.y - handguard.width / 2, 10);
    expect(laser.x).toBeGreaterThanOrEqual(handguard.x);

    const flashlightMount = resolveAnchor(
      flashlight,
      getAnchor(flashlight, "mount"),
    );
    expect(flashlightMount.y).toBeCloseTo(
      handguard.y + handguard.width / 2,
      10,
    );
    expect(flashlight.x).toBeGreaterThanOrEqual(handguard.x);

    const frontGripMount = resolveAnchor(
      frontGrip,
      getAnchor(frontGrip, "mount"),
    );
    expect(frontGripMount.y).toBeCloseTo(handguard.y + handguard.width / 2, 10);
  });

  it("computes bounds that include rotated vertical parts", () => {
    const result = layoutWeapon([
      new ReceiverPart("receiver-test"),
      new BarrelPart("barrel-test"),
      new MagwellPart("magwell-test"),
      new MagazinePart("magazine-test"),
      new PistolGripPart("pistol-grip-test"),
      new FrontGripPart("front-grip-test"),
      new HandguardPart("handguard-test"),
    ]);

    const majorAxisKinds = new Set([
      "magwell",
      "magazine",
      "pistolGrip",
      "frontGrip",
    ]);

    for (const part of result.layout) {
      const major = majorAxisKinds.has(part.kind) ? part.width : part.length;
      const minor = majorAxisKinds.has(part.kind) ? part.length : part.width;
      const radians = (part.rotationDeg * Math.PI) / 180;
      const halfX =
        Math.abs(Math.cos(radians)) * (major / 2) +
        Math.abs(Math.sin(radians)) * (minor / 2);
      const halfY =
        Math.abs(Math.sin(radians)) * (major / 2) +
        Math.abs(Math.cos(radians)) * (minor / 2);

      expect(result.bounds.minX).toBeLessThanOrEqual(part.x - halfX);
      expect(result.bounds.maxX).toBeGreaterThanOrEqual(part.x + halfX);
      expect(result.bounds.minY).toBeLessThanOrEqual(part.y - halfY);
      expect(result.bounds.maxY).toBeGreaterThanOrEqual(part.y + halfY);
    }
  });
});
