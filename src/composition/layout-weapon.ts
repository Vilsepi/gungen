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

// Rotation angle for the magwell (and rifle magazine) relative to vertical.
// After the horizontal SVG mirror, this creates a natural forward lean.
const MAGWELL_ROT_DEG = 0;
const MAGWELL_SIN = Math.sin((MAGWELL_ROT_DEG * Math.PI) / 180);
const MAGWELL_COS = Math.cos((MAGWELL_ROT_DEG * Math.PI) / 180);

// Rotation angle for the pistol grip assembly (grip, magwell, and magazine on pistols).
const PISTOL_ROT_DEG = 10;
const PISTOL_SIN = Math.sin((PISTOL_ROT_DEG * Math.PI) / 180);
const PISTOL_COS = Math.cos((PISTOL_ROT_DEG * Math.PI) / 180);

function partMap(parts: Part[]): Map<string, Part> {
  return new Map(parts.map((part) => [part.kind, part]));
}

function interpolateAlong(sizeX: number, ratio: number): number {
  return -sizeX / 2 + sizeX * ratio;
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
  category: WeaponCategory,
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
  const receiverSizeX = Number(receiver.dimensionsMm.sizeX);
  const receiverSizeY = Number(receiver.dimensionsMm.sizeY);
  const barrelSizeX = Number(barrel.dimensionsMm.sizeX);
  const barrelSizeY = Number(barrel.dimensionsMm.sizeY);

  const receiverLayout = createLayoutPart(receiver, {
    x: 0,
    y: 0,
    rotationDeg: 0,
    sizeX: receiverSizeX,
    sizeY: receiverSizeY,
    anchors: {
      top: { x: -receiverSizeX * 0.08, y: -receiverSizeY / 2 },
      bottom: { x: receiverSizeX * 0.04, y: receiverSizeY / 2 },
      front: { x: receiverSizeX / 2, y: 0 },
      rear: { x: -receiverSizeX / 2, y: 0 },
    },
  });
  layout.push(receiverLayout);

  const hasHandguard = byKind.has("handguard");
  const handguardSizeX = hasHandguard
    ? Number(byKind.get("handguard")?.dimensionsMm.sizeX ?? 0)
    : 0;
  const handguardSizeY = hasHandguard
    ? Number(byKind.get("handguard")?.dimensionsMm.sizeY ?? 0)
    : 0;
  let handguardLayout: LayoutPart | undefined;
  if (hasHandguard) {
    handguardLayout = createLayoutPart(byKind.get("handguard")!, {
      x: receiverSizeX / 2 + handguardSizeX / 2 - 8,
      y: 4,
      rotationDeg: 0,
      sizeX: handguardSizeX,
      sizeY: handguardSizeY,
      anchors: {
        rear: { x: -handguardSizeX / 2, y: 0 },
        front: { x: handguardSizeX / 2, y: 0 },
        bottom: { x: handguardSizeX * 0.15, y: handguardSizeY / 2 },
        side: { x: handguardSizeX * 0.1, y: 0 },
      },
    });
    layout.push(handguardLayout);
  }

  layout.push(
    createLayoutPart(barrel, {
      x: receiverSizeX / 2 + barrelSizeX / 2 + (hasHandguard ? 18 : 8),
      y: 0,
      rotationDeg: 0,
      sizeX: barrelSizeX,
      sizeY: barrelSizeY,
      anchors: {
        start: { x: -barrelSizeX / 2, y: 0 },
        end: { x: barrelSizeX / 2, y: 0 },
      },
    }),
  );

  const magwellSizeX = Number(magwell.dimensionsMm.sizeX);
  const magwellSizeY = Number(magwell.dimensionsMm.sizeY);
  const magazineSizeX = Number(magazine.dimensionsMm.sizeX);
  const magazineSizeY = Number(magazine.dimensionsMm.sizeY);
  const gripSizeX = Number(pistolGrip.dimensionsMm.sizeX);
  const gripSizeY = Number(pistolGrip.dimensionsMm.sizeY);

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
    const gripCenterX = -receiverSizeX * 0.1;
    const gripCenterY = receiverSizeY * 0.78;
    magwellRot = PISTOL_ROT_DEG;
    magwellX = gripCenterX - ((gripSizeX + magwellSizeX) / 2) * PISTOL_SIN;
    magwellY = gripCenterY + ((gripSizeX + magwellSizeX) / 2) * PISTOL_COS;
    magRot = PISTOL_ROT_DEG;
    magX = magwellX - ((magwellSizeX + magazineSizeX) / 2) * PISTOL_SIN;
    magY = magwellY + ((magwellSizeX + magazineSizeX) / 2) * PISTOL_COS;
  } else {
    // For long guns: magwell hangs below the receiver; magazine centerline aligns
    // with the magwell centerline so the feed end seats flush in the magwell.
    magwellRot = MAGWELL_ROT_DEG;
    magwellX = receiverSizeX * 0.05;
    magwellY = receiverSizeY * 0.55;
    magRot = MAGWELL_ROT_DEG;
    magX = magwellX - ((magwellSizeX + magazineSizeX) / 2) * MAGWELL_SIN;
    magY = magwellY + ((magwellSizeX + magazineSizeX) / 2) * MAGWELL_COS;
  }

  layout.push(
    createLayoutPart(magwell, {
      x: magwellX,
      y: magwellY,
      rotationDeg: magwellRot,
      sizeX: magwellSizeX,
      sizeY: magwellSizeY,
      anchors: {
        host: { x: 0, y: -magwellSizeX / 2 },
        mag: { x: 0, y: magwellSizeX / 2 },
      },
    }),
  );

  layout.push(
    createLayoutPart(magazine, {
      x: magX,
      y: magY,
      rotationDeg: magRot,
      sizeX: magazineSizeX,
      sizeY: magazineSizeY,
      anchors: {
        feed: { x: 0, y: -magazineSizeX / 2 },
      },
    }),
  );

  layout.push(
    createLayoutPart(pistolGrip, {
      x: -receiverSizeX * 0.1,
      y: receiverSizeY * 0.78,
      rotationDeg: 22,
      sizeX: gripSizeX,
      sizeY: gripSizeY,
      anchors: {
        mount: { x: 0, y: -gripSizeX / 2 },
      },
    }),
  );

  const stock = byKind.get("stock");
  if (stock) {
    const stockSizeX = Number(stock.dimensionsMm.sizeX);
    const stockSizeY = Number(stock.dimensionsMm.sizeY);
    layout.push(
      createLayoutPart(stock, {
        x: -(receiverSizeX / 2 + stockSizeX / 2 - 10),
        y: 2,
        rotationDeg: 0,
        sizeX: stockSizeX,
        sizeY: stockSizeY,
        anchors: {
          mount: { x: stockSizeX / 2, y: 0 },
        },
      }),
    );
  }

  const optic = byKind.get("optic");
  if (optic) {
    const opticSizeX = Number(optic.dimensionsMm.sizeX);
    const opticSizeY = Number(optic.dimensionsMm.sizeY);
    layout.push(
      createLayoutPart(optic, {
        x: receiverSizeX * 0.02,
        y: receiverLayout.y - receiverLayout.sizeY / 2 - opticSizeY / 2,
        rotationDeg: 0,
        sizeX: opticSizeX,
        sizeY: opticSizeY,
        anchors: {
          mount: { x: 0, y: opticSizeY / 2 },
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
    const partSizeX = Number(part.dimensionsMm.sizeX);
    const partSizeY = Number(part.dimensionsMm.sizeY);
    const mount =
      kind === "frontGrip"
        ? { x: 0, y: -partSizeX / 2 }
        : { x: 0, y: -partSizeY / 2 };
    const rotatedMount = rotatePoint(mount.x, mount.y, rotationDeg);
    const contactX = host.x + interpolateAlong(host.sizeX, xRatio);
    const contactY =
      host.y + (hostSide === "top" ? -host.sizeY / 2 : host.sizeY / 2);

    layout.push(
      createLayoutPart(part, {
        x: contactX - rotatedMount.x,
        y: contactY - rotatedMount.y,
        rotationDeg,
        sizeX: partSizeX,
        sizeY: partSizeY,
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
    const muzzleDeviceSizeX = Number(muzzleDevice.dimensionsMm.sizeX);
    const muzzleDeviceSizeY = Number(muzzleDevice.dimensionsMm.sizeY);
    layout.push(
      createLayoutPart(muzzleDevice, {
        x:
          receiverSizeX / 2 +
          barrelSizeX +
          muzzleDeviceSizeX / 2 +
          (hasHandguard ? 18 : 8),
        y: 0,
        rotationDeg: 0,
        sizeX: muzzleDeviceSizeX,
        sizeY: muzzleDeviceSizeY,
        anchors: {
          mount: { x: -muzzleDeviceSizeX / 2, y: 0 },
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
    totalSizeX: mm(bounds.maxX - bounds.minX),
    totalSizeY: mm(bounds.maxY - bounds.minY),
  };

  return { layout, bounds, metrics };
}
