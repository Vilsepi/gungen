import { describe, expect, it } from "vitest";

import {
  partLevelPriceMultipliers,
  partPricePerGramCents,
} from "../core/constants";
import { LayoutAnchor, LayoutPart, mm } from "../core/types";
import {
  BarrelPart,
  FlashlightPart,
  FrontGripPart,
  HandguardPart,
  LaserPart,
  MagwellPart,
  MagazinePart,
  MuzzleDevicePart,
  OpticPart,
  PistolGripPart,
  ReceiverPart,
  StockPart,
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
  it("sums total price from each part mass and kind multiplier", () => {
    const parts = [
      new ReceiverPart("receiver-test"),
      new BarrelPart("barrel-test", "Improved"),
      new MagwellPart("magwell-test", "Rare"),
      new MagazinePart("magazine-test", "Exotic"),
      new PistolGripPart("pistol-grip-test"),
      new OpticPart("optic-test", "Improved"),
    ];

    const result = layoutWeapon(parts);
    const expectedTotalMass = parts.reduce(
      (sum, part) => sum + Number(part.mass),
      0,
    );
    const expectedTotalPrice = parts.reduce(
      (sum, part) =>
        sum +
        Math.round(
          Number(part.mass) *
            partPricePerGramCents[part.kind] *
            partLevelPriceMultipliers[part.partLevel],
        ),
      0,
    );

    expect(Number(result.metrics.totalMass)).toBeCloseTo(expectedTotalMass, 10);
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

    expect(getPart(result.layout, "receiver").partLevel).toBe("Normal");

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

  it("copies bom part dimensionsMm to layout part length and width", () => {
    const receiver = new ReceiverPart("receiver-test");
    const barrel = new BarrelPart("barrel-test");
    const magwell = new MagwellPart("magwell-test");
    const magazine = new MagazinePart("magazine-test");
    const pistolGrip = new PistolGripPart("pistol-grip-test");
    const stock = new StockPart("stock-test");
    const optic = new OpticPart("optic-test");
    const handguard = new HandguardPart("handguard-test");
    const laser = new LaserPart("laser-test");
    const flashlight = new FlashlightPart("flashlight-test");
    const muzzleDevice = new MuzzleDevicePart("muzzle-device-test");
    const frontGrip = new FrontGripPart("front-grip-test");

    receiver.dimensionsMm = { length: mm(200), width: mm(50) };
    barrel.dimensionsMm = { length: mm(400), width: mm(18) };
    magwell.dimensionsMm = { length: mm(60), width: mm(30) };
    magazine.dimensionsMm = { length: mm(180), width: mm(28) };
    pistolGrip.dimensionsMm = { length: mm(100), width: mm(30) };
    stock.dimensionsMm = { length: mm(250), width: mm(55) };
    optic.dimensionsMm = { length: mm(80), width: mm(35) };
    handguard.dimensionsMm = { length: mm(320), width: mm(45) };
    laser.dimensionsMm = { length: mm(70), width: mm(22) };
    flashlight.dimensionsMm = { length: mm(90), width: mm(26) };
    muzzleDevice.dimensionsMm = { length: mm(45), width: mm(20) };
    frontGrip.dimensionsMm = { length: mm(80), width: mm(28) };

    const result = layoutWeapon([
      receiver,
      barrel,
      magwell,
      magazine,
      pistolGrip,
      stock,
      optic,
      handguard,
      laser,
      flashlight,
      muzzleDevice,
      frontGrip,
    ]);

    const cases: Array<[LayoutPart["kind"], number, number]> = [
      ["receiver", 200, 50],
      ["barrel", 400, 18],
      ["magwell", 60, 30],
      ["magazine", 180, 28],
      ["pistolGrip", 100, 30],
      ["stock", 250, 55],
      ["optic", 80, 35],
      ["handguard", 320, 45],
      ["laser", 70, 22],
      ["flashlight", 90, 26],
      ["muzzleDevice", 45, 20],
      ["frontGrip", 80, 28],
    ];

    for (const [kind, expectedLength, expectedWidth] of cases) {
      const layoutPart = getPart(result.layout, kind);
      expect(layoutPart.length, `${kind} length`).toBe(expectedLength);
      expect(layoutPart.width, `${kind} width`).toBe(expectedWidth);
    }
  });
});
