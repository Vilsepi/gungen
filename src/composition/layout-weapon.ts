import {
  cents,
  grams,
  LayoutPart,
  mm,
  WeaponCategory,
  WeaponMetrics,
} from "../core/types";
import { Weapon } from "../domain/bom/weapon";
import { Part } from "../domain/parts";
import { computePartPrice } from "../domain/physics/price";
import { computeBounds } from "./normalize-layout";

const MAGWELL_ROT_DEG = 16;
const MAGWELL_SIN = Math.sin((MAGWELL_ROT_DEG * Math.PI) / 180);
const MAGWELL_COS = Math.cos((MAGWELL_ROT_DEG * Math.PI) / 180);

const PISTOL_ROT_DEG = 22;
const PISTOL_SIN = Math.sin((PISTOL_ROT_DEG * Math.PI) / 180);
const PISTOL_COS = Math.cos((PISTOL_ROT_DEG * Math.PI) / 180);

function partMap(parts: Part[]): Map<string, Part> {
  return new Map(parts.map((part) => [part.kind, part]));
}

function interpolateAlong(length: number, ratio: number): number {
  return -length / 2 + length * ratio;
}

function rotatePoint(
  x: number,
  y: number,
  rotationDeg: number,
): {
  x: number;
  y: number;
} {
  const radians = (rotationDeg * Math.PI) / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  return {
    x: x * cos - y * sin,
    y: x * sin + y * cos,
  };
}

function createLayoutPart(
  part: Part,
  input: Omit<LayoutPart, "partId" | "kind" | "partLevel">,
): LayoutPart {
  return {
    partId: part.id,
    kind: part.kind,
    partLevel: part.partLevel,
    ...input,
  };
}

export function layoutWeapon(
  parts: Part[],
  category: WeaponCategory = "AssaultRifle",
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

  const receiverLayout = createLayoutPart(receiver, {
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
  layout.push(receiverLayout);

  const hasHandguard = byKind.has("handguard");
  const handguardLength = hasHandguard
    ? Number(byKind.get("handguard")?.dimensionsMm.length ?? 0)
    : 0;
  const handguardWidth = hasHandguard
    ? Number(byKind.get("handguard")?.dimensionsMm.width ?? 0)
    : 0;
  let handguardLayout: LayoutPart | undefined;
  if (hasHandguard) {
    handguardLayout = createLayoutPart(byKind.get("handguard")!, {
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
    layout.push(handguardLayout);
  }

  layout.push(
    createLayoutPart(barrel, {
      x: receiverLength / 2 + barrelLength / 2 + (hasHandguard ? 18 : 8),
      y: 0,
      rotationDeg: 0,
      length: barrelLength,
      width: barrelWidth,
      anchors: {
        start: { x: -barrelLength / 2, y: 0 },
        end: { x: barrelLength / 2, y: 0 },
      },
    }),
  );

  const magwellLength = Number(magwell.dimensionsMm.length);
  const magwellWidth = Number(magwell.dimensionsMm.width);
  const magLength = Number(magazine.dimensionsMm.length);
  const magWidth = Number(magazine.dimensionsMm.width);
  const gripLength = Number(pistolGrip.dimensionsMm.length);
  const gripWidth = Number(pistolGrip.dimensionsMm.width);

  const isPistol = category === "Pistol";

  let magwellX: number;
  let magwellY: number;
  let magwellRot: number;
  let magX: number;
  let magY: number;
  let magRot: number;

  if (isPistol) {
    // For pistols: align magwell and magazine with the pistol grip (same rotation).
    // The magwell sits directly below the grip, and the magazine sits below the magwell.
    const gripCenterX = -receiverLength * 0.1;
    const gripCenterY = receiverWidth * 0.78;
    magwellRot = PISTOL_ROT_DEG;
    magwellX = gripCenterX - ((gripLength + magwellLength) / 2) * PISTOL_SIN;
    magwellY = gripCenterY + ((gripLength + magwellLength) / 2) * PISTOL_COS;
    magRot = PISTOL_ROT_DEG;
    magX = magwellX - ((magwellLength + magLength) / 2) * PISTOL_SIN;
    magY = magwellY + ((magwellLength + magLength) / 2) * PISTOL_COS;
  } else {
    // For long guns: magwell hangs below the receiver; magazine centerline aligns
    // with the magwell centerline so the feed end seats flush in the magwell.
    magwellRot = MAGWELL_ROT_DEG;
    magwellX = receiverLength * 0.05;
    magwellY = receiverWidth * 0.55;
    magRot = MAGWELL_ROT_DEG;
    magX = magwellX - ((magwellLength + magLength) / 2) * MAGWELL_SIN;
    magY = magwellY + ((magwellLength + magLength) / 2) * MAGWELL_COS;
  }

  layout.push(
    createLayoutPart(magwell, {
      x: magwellX,
      y: magwellY,
      rotationDeg: magwellRot,
      length: magwellLength,
      width: magwellWidth,
      anchors: {
        host: { x: 0, y: -magwellLength / 2 },
        mag: { x: 0, y: magwellLength / 2 },
      },
    }),
  );

  layout.push(
    createLayoutPart(magazine, {
      x: magX,
      y: magY,
      rotationDeg: magRot,
      length: magLength,
      width: magWidth,
      anchors: {
        feed: { x: 0, y: -magLength / 2 },
      },
    }),
  );

  layout.push(
    createLayoutPart(pistolGrip, {
      x: -receiverLength * 0.1,
      y: receiverWidth * 0.78,
      rotationDeg: 22,
      length: gripLength,
      width: gripWidth,
      anchors: {
        mount: { x: 0, y: -gripLength / 2 },
      },
    }),
  );

  const stock = byKind.get("stock");
  if (stock) {
    const stockLength = Number(stock.dimensionsMm.length);
    const stockWidth = Number(stock.dimensionsMm.width);
    layout.push(
      createLayoutPart(stock, {
        x: -(receiverLength / 2 + stockLength / 2 - 10),
        y: 2,
        rotationDeg: 0,
        length: stockLength,
        width: stockWidth,
        anchors: {
          mount: { x: stockLength / 2, y: 0 },
        },
      }),
    );
  }

  const optic = byKind.get("optic");
  if (optic) {
    const opticLength = Number(optic.dimensionsMm.length);
    const opticWidth = Number(optic.dimensionsMm.width);
    layout.push(
      createLayoutPart(optic, {
        x: receiverLength * 0.02,
        y: receiverLayout.y - receiverLayout.width / 2 - opticWidth / 2,
        rotationDeg: 0,
        length: opticLength,
        width: opticWidth,
        anchors: {
          mount: { x: 0, y: opticWidth / 2 },
        },
      }),
    );
  }

  const placeGuardAccessory = (
    kind: "laser" | "flashlight" | "frontGrip",
    xRatio: number,
    hostSide: "top" | "bottom",
    rotationDeg: number,
  ) => {
    const part = byKind.get(kind);
    if (!part) {
      return;
    }

    const host = handguardLayout ?? receiverLayout;
    const length = Number(part.dimensionsMm.length);
    const width = Number(part.dimensionsMm.width);
    const mount =
      kind === "frontGrip" ? { x: 0, y: -length / 2 } : { x: 0, y: -width / 2 };
    const rotatedMount = rotatePoint(mount.x, mount.y, rotationDeg);
    const contactX = host.x + interpolateAlong(host.length, xRatio);
    const contactY =
      host.y + (hostSide === "top" ? -host.width / 2 : host.width / 2);

    layout.push(
      createLayoutPart(part, {
        x: contactX - rotatedMount.x,
        y: contactY - rotatedMount.y,
        rotationDeg,
        length,
        width,
        anchors: {
          mount,
        },
      }),
    );
  };

  const guardAccessoryRatios = handguardLayout
    ? {
        laser: 0.76,
        flashlight: 0.72,
        frontGrip: 0.46,
      }
    : {
        laser: 0.25,
        flashlight: 0.18,
        frontGrip: 0.42,
      };

  placeGuardAccessory("laser", guardAccessoryRatios.laser, "top", 0);
  placeGuardAccessory(
    "flashlight",
    guardAccessoryRatios.flashlight,
    "bottom",
    0,
  );
  placeGuardAccessory("frontGrip", guardAccessoryRatios.frontGrip, "bottom", 6);

  const muzzleDevice = byKind.get("muzzleDevice");
  if (muzzleDevice) {
    const length = Number(muzzleDevice.dimensionsMm.length);
    const width = Number(muzzleDevice.dimensionsMm.width);
    layout.push(
      createLayoutPart(muzzleDevice, {
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
      }),
    );
  }

  const bounds = computeBounds(layout);
  const totalMass = parts.reduce((sum, part) => sum + Number(part.mass), 0);
  const totalPrice = parts.reduce(
    (sum, part) =>
      sum + Number(computePartPrice(part.kind, part.mass, part.partLevel)),
    0,
  );
  const metrics: WeaponMetrics = {
    totalMass: grams(totalMass),
    totalPrice: cents(totalPrice),
    totalLength: mm(bounds.maxX - bounds.minX),
    totalHeight: mm(bounds.maxY - bounds.minY),
  };

  return { layout, bounds, metrics };
}
