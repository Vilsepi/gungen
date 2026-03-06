import { grams, LayoutPart, mm, WeaponMetrics } from "../core/types";
import { Weapon } from "../domain/bom/weapon";
import { Part } from "../domain/parts";
import { computeBounds } from "./normalize-layout";

function partMap(parts: Part[]): Map<string, Part> {
  return new Map(parts.map((part) => [part.kind, part]));
}

export function layoutWeapon(
  parts: Part[],
): Pick<Weapon, "layout" | "bounds" | "metrics"> {
  const byKind = partMap(parts);
  const receiver = byKind.get("receiver");
  const barrel = byKind.get("barrel");
  const magwell = byKind.get("magwell");
  const magazine = byKind.get("magazine");
  const pistolGrip = byKind.get("pistolGrip");

  if (!receiver || !barrel || !magwell || !magazine || !pistolGrip) {
    throw new Error("Missing core parts during layout.");
  }

  const layout: LayoutPart[] = [];
  const receiverLength = Number(receiver.dimensionsMm.length);
  const receiverWidth = Number(receiver.dimensionsMm.width);
  const barrelLength = Number(barrel.dimensionsMm.length);
  const barrelWidth = Number(barrel.dimensionsMm.width);

  layout.push({
    partId: receiver.id,
    kind: receiver.kind,
    x: 0,
    y: 0,
    rotationDeg: 0,
    length: receiverLength,
    width: receiverWidth,
    anchors: {
      top: { x: -receiverLength * 0.08, y: -receiverWidth / 2 },
      bottom: { x: receiverLength * 0.04, y: receiverWidth / 2 },
      front: { x: receiverLength / 2, y: 0 },
      rear: { x: -receiverLength / 2, y: 0 },
    },
  });

  const hasHandguard = byKind.has("handguard");
  const handguardLength = hasHandguard
    ? Number(byKind.get("handguard")?.dimensionsMm.length ?? 0)
    : 0;
  const handguardWidth = hasHandguard
    ? Number(byKind.get("handguard")?.dimensionsMm.width ?? 0)
    : 0;
  if (hasHandguard) {
    layout.push({
      partId: byKind.get("handguard")!.id,
      kind: "handguard",
      x: receiverLength / 2 + handguardLength / 2 - 8,
      y: 4,
      rotationDeg: 0,
      length: handguardLength,
      width: handguardWidth,
      anchors: {
        rear: { x: -handguardLength / 2, y: 0 },
        front: { x: handguardLength / 2, y: 0 },
        bottom: { x: handguardLength * 0.15, y: handguardWidth / 2 },
        side: { x: handguardLength * 0.1, y: 0 },
      },
    });
  }

  layout.push({
    partId: barrel.id,
    kind: barrel.kind,
    x: receiverLength / 2 + barrelLength / 2 + (hasHandguard ? 18 : 8),
    y: 0,
    rotationDeg: 0,
    length: barrelLength,
    width: barrelWidth,
    anchors: {
      start: { x: -barrelLength / 2, y: 0 },
      end: { x: barrelLength / 2, y: 0 },
    },
  });

  const magwellLength = Number(magwell.dimensionsMm.length);
  const magwellWidth = Number(magwell.dimensionsMm.width);
  layout.push({
    partId: magwell.id,
    kind: magwell.kind,
    x: receiverLength * 0.05,
    y: receiverWidth * 0.55,
    rotationDeg: 16,
    length: magwellLength,
    width: magwellWidth,
    anchors: {
      host: { x: 0, y: -magwellWidth / 2 },
      mag: { x: 0, y: magwellWidth / 2 },
    },
  });

  const magLength = Number(magazine.dimensionsMm.length);
  const magWidth = Number(magazine.dimensionsMm.width);
  layout.push({
    partId: magazine.id,
    kind: magazine.kind,
    x: receiverLength * 0.06,
    y: receiverWidth + magLength * 0.42,
    rotationDeg: 10,
    length: magLength,
    width: magWidth,
    anchors: {
      feed: { x: 0, y: -magLength / 2 },
    },
  });

  const gripLength = Number(pistolGrip.dimensionsMm.length);
  const gripWidth = Number(pistolGrip.dimensionsMm.width);
  layout.push({
    partId: pistolGrip.id,
    kind: pistolGrip.kind,
    x: -receiverLength * 0.1,
    y: receiverWidth * 0.78,
    rotationDeg: 22,
    length: gripLength,
    width: gripWidth,
    anchors: {
      mount: { x: 0, y: -gripLength / 2 },
    },
  });

  const stock = byKind.get("stock");
  if (stock) {
    const stockLength = Number(stock.dimensionsMm.length);
    const stockWidth = Number(stock.dimensionsMm.width);
    layout.push({
      partId: stock.id,
      kind: stock.kind,
      x: -(receiverLength / 2 + stockLength / 2 - 10),
      y: 2,
      rotationDeg: 0,
      length: stockLength,
      width: stockWidth,
      anchors: {
        mount: { x: stockLength / 2, y: 0 },
      },
    });
  }

  const optic = byKind.get("optic");
  if (optic) {
    const opticLength = Number(optic.dimensionsMm.length);
    const opticWidth = Number(optic.dimensionsMm.width);
    layout.push({
      partId: optic.id,
      kind: optic.kind,
      x: receiverLength * 0.02,
      y: -(receiverWidth / 2 + opticWidth * 0.9),
      rotationDeg: 0,
      length: opticLength,
      width: opticWidth,
      anchors: {
        mount: { x: 0, y: opticWidth / 2 },
      },
    });
  }

  const placeGuardAccessory = (
    kind: "laser" | "flashlight" | "frontGrip" | "handStop",
    xBias: number,
    yBias: number,
    rotationDeg: number,
  ) => {
    const part = byKind.get(kind);
    if (!part) {
      return;
    }
    const length = Number(part.dimensionsMm.length);
    const width = Number(part.dimensionsMm.width);
    layout.push({
      partId: part.id,
      kind,
      x: receiverLength / 2 + (hasHandguard ? handguardLength * xBias : 20),
      y: yBias,
      rotationDeg,
      length,
      width,
      anchors: {
        mount: { x: 0, y: -width / 2 },
      },
    });
  };

  placeGuardAccessory("laser", 0.25, -(receiverWidth / 2 + 18), 0);
  placeGuardAccessory("flashlight", 0.18, receiverWidth / 2 + 22, 0);
  placeGuardAccessory("frontGrip", 0.42, receiverWidth / 2 + 48, 6);
  placeGuardAccessory("handStop", 0.45, receiverWidth / 2 + 24, 0);

  const muzzleDevice = byKind.get("muzzleDevice");
  if (muzzleDevice) {
    const length = Number(muzzleDevice.dimensionsMm.length);
    const width = Number(muzzleDevice.dimensionsMm.width);
    layout.push({
      partId: muzzleDevice.id,
      kind: muzzleDevice.kind,
      x:
        receiverLength / 2 +
        barrelLength +
        length / 2 +
        (hasHandguard ? 18 : 8),
      y: 0,
      rotationDeg: 0,
      length,
      width,
      anchors: {
        mount: { x: -length / 2, y: 0 },
      },
    });
  }

  const bounds = computeBounds(layout);
  const metrics: WeaponMetrics = {
    totalWeight: grams(
      parts.reduce((sum, part) => sum + Number(part.weight), 0),
    ),
    totalLength: mm(bounds.maxX - bounds.minX),
    totalHeight: mm(bounds.maxY - bounds.minY),
  };

  return { layout, bounds, metrics };
}
