import { baseDimensionRanges, partDensities } from "../../core/constants";
import {
  AttachmentPointSpec,
  mm,
  PartKind,
  PartLevel,
  DimensionsMm,
  DimensionRangeMm,
} from "../../core/types";
import { computeArea, computeWeight } from "../physics/weight";
import { Part } from "./part";

class GenericPart extends Part {
  constructor(
    id: string,
    kind: PartKind,
    partLevel: PartLevel,
    displayName: string,
    attachmentPointSpecs: AttachmentPointSpec[],
    range: DimensionRangeMm,
  ) {
    const dimensionsMm: DimensionsMm = {
      length: mm(Number(range.minLength)),
      width: mm(Number(range.minWidth)),
    };
    const area = computeArea(
      Number(dimensionsMm.length),
      Number(dimensionsMm.width),
    );
    const weight = computeWeight(area, partDensities[kind]);
    super({
      id,
      kind,
      partLevel,
      displayName,
      density: partDensities[kind],
      baseRange: range,
      attachmentPointSpecs,
      dimensionsMm,
      area,
      weight,
    });
  }
}

function createPartClass(
  kind: PartKind,
  displayName: string,
  attachmentPointSpecs: AttachmentPointSpec[],
) {
  return class extends GenericPart {
    constructor(id: string, partLevel: PartLevel = "Normal") {
      super(
        id,
        kind,
        partLevel,
        displayName,
        attachmentPointSpecs,
        baseDimensionRanges[kind],
      );
    }
  };
}

export const ReceiverPart = createPartClass("receiver", "Receiver", [
  { id: "top", kind: "top", allowedPartKinds: ["optic"], maxConnections: 2 },
  {
    id: "bottom",
    kind: "bottom",
    allowedPartKinds: ["pistolGrip", "magwell"],
    maxConnections: 2,
  },
  {
    id: "front",
    kind: "front",
    allowedPartKinds: ["barrel", "handguard"],
    maxConnections: 2,
  },
  { id: "rear", kind: "rear", allowedPartKinds: ["stock"], maxConnections: 1 },
]);

export const BarrelPart = createPartClass("barrel", "Barrel", [
  {
    id: "start",
    kind: "barrelStart",
    allowedPartKinds: ["receiver", "handguard"],
    maxConnections: 1,
  },
  {
    id: "end",
    kind: "barrelEnd",
    allowedPartKinds: ["muzzleDevice"],
    maxConnections: 1,
  },
]);

export const HandguardPart = createPartClass("handguard", "Handguard", [
  {
    id: "rear",
    kind: "back",
    allowedPartKinds: ["receiver"],
    maxConnections: 1,
  },
  {
    id: "front",
    kind: "front",
    allowedPartKinds: ["barrel"],
    maxConnections: 1,
  },
  {
    id: "bottom",
    kind: "bottom",
    allowedPartKinds: ["flashlight", "frontGrip", "laser"],
    maxConnections: 3,
  },
  {
    id: "side",
    kind: "side",
    allowedPartKinds: ["flashlight", "laser"],
    maxConnections: 2,
  },
]);

export const MagwellPart = createPartClass("magwell", "Magwell", [
  {
    id: "host",
    kind: "back",
    allowedPartKinds: ["receiver", "pistolGrip"],
    maxConnections: 1,
  },
  {
    id: "mag",
    kind: "magOut",
    allowedPartKinds: ["magazine"],
    maxConnections: 1,
  },
]);

export const MagazinePart = createPartClass("magazine", "Magazine", [
  {
    id: "feed",
    kind: "magIn",
    allowedPartKinds: ["magwell"],
    maxConnections: 1,
  },
]);

export const PistolGripPart = createPartClass("pistolGrip", "Pistol Grip", [
  {
    id: "mount",
    kind: "top",
    allowedPartKinds: ["receiver", "magwell"],
    maxConnections: 1,
  },
]);

export const StockPart = createPartClass("stock", "Stock", [
  {
    id: "mount",
    kind: "front",
    allowedPartKinds: ["receiver"],
    maxConnections: 1,
  },
]);

export const OpticPart = createPartClass("optic", "Optic", [
  {
    id: "mount",
    kind: "bottom",
    allowedPartKinds: ["receiver"],
    maxConnections: 1,
  },
]);

export const LaserPart = createPartClass("laser", "Laser", [
  {
    id: "mount",
    kind: "top",
    allowedPartKinds: ["handguard"],
    maxConnections: 1,
  },
]);

export const FlashlightPart = createPartClass("flashlight", "Flashlight", [
  {
    id: "mount",
    kind: "top",
    allowedPartKinds: ["handguard"],
    maxConnections: 1,
  },
]);

export const MuzzleDevicePart = createPartClass(
  "muzzleDevice",
  "Muzzle Device",
  [
    {
      id: "mount",
      kind: "back",
      allowedPartKinds: ["barrel"],
      maxConnections: 1,
    },
  ],
);

export const FrontGripPart = createPartClass("frontGrip", "Front Grip", [
  {
    id: "mount",
    kind: "top",
    allowedPartKinds: ["handguard"],
    maxConnections: 1,
  },
]);

export const partConstructors: Record<
  PartKind,
  new (id: string, partLevel?: PartLevel) => Part
> = {
  receiver: ReceiverPart,
  barrel: BarrelPart,
  magwell: MagwellPart,
  magazine: MagazinePart,
  pistolGrip: PistolGripPart,
  handguard: HandguardPart,
  stock: StockPart,
  optic: OpticPart,
  laser: LaserPart,
  flashlight: FlashlightPart,
  muzzleDevice: MuzzleDevicePart,
  frontGrip: FrontGripPart,
};
