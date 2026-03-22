import { DimensionRangeMm, mm, PartKind, PartLevel } from "./types";

export const baseDimensionRanges: Record<PartKind, DimensionRangeMm> = {
  receiver: {
    minSizeX: mm(140),
    maxSizeX: mm(300),
    minSizeY: mm(32),
    maxSizeY: mm(62),
  },
  barrel: {
    minSizeX: mm(20),
    maxSizeX: mm(620),
    minSizeY: mm(15),
    maxSizeY: mm(24),
  },
  magwell: {
    minSizeX: mm(20),
    maxSizeX: mm(50),
    minSizeY: mm(50),
    maxSizeY: mm(100),
  },
  magazine: {
    minSizeX: mm(90),
    maxSizeX: mm(250),
    minSizeY: mm(33),
    maxSizeY: mm(80),
  },
  pistolGrip: {
    minSizeX: mm(70),
    maxSizeX: mm(115),
    minSizeY: mm(45),
    maxSizeY: mm(60),
  },
  handguard: {
    minSizeX: mm(0),
    maxSizeX: mm(400),
    minSizeY: mm(40),
    maxSizeY: mm(70),
  },
  stock: {
    minSizeX: mm(130),
    maxSizeX: mm(270),
    minSizeY: mm(60),
    maxSizeY: mm(120),
  },
  optic: {
    minSizeX: mm(40),
    maxSizeX: mm(350),
    minSizeY: mm(25),
    maxSizeY: mm(50),
  },
  laser: {
    minSizeX: mm(35),
    maxSizeX: mm(80),
    minSizeY: mm(14),
    maxSizeY: mm(28),
  },
  flashlight: {
    minSizeX: mm(55),
    maxSizeX: mm(130),
    minSizeY: mm(25),
    maxSizeY: mm(30),
  },
  muzzleDevice: {
    minSizeX: mm(15),
    maxSizeX: mm(120),
    minSizeY: mm(22),
    maxSizeY: mm(45),
  },
  frontGrip: {
    minSizeX: mm(30),
    maxSizeX: mm(90),
    minSizeY: mm(20),
    maxSizeY: mm(34),
  },
};

// These densities are not based on realistic materials, just chosen to output realistic masses based on the inaccurate dimensions.
export const partDensities: Record<PartKind, number> = {
  receiver: 0.062,
  barrel: 0.095,
  magwell: 0.06,
  magazine: 0.06,
  pistolGrip: 0.055,

  handguard: 0.085,
  stock: 0.09,
  optic: 0.075,
  laser: 0.06,
  flashlight: 0.06,
  muzzleDevice: 0.075,
  frontGrip: 0.055,
};

// These prices are not based on realistic materials, just chosen to output realistic prices based on the inaccurate dimensions.
export const partPricePerGramCents: Record<PartKind, number> = {
  receiver: 140,
  barrel: 120,
  magwell: 60,
  magazine: 42,
  pistolGrip: 48,
  handguard: 60,
  stock: 55,
  optic: 300,
  laser: 235,
  flashlight: 105,
  muzzleDevice: 100,
  frontGrip: 55,
};

// Odds for part upgrade levels to appear
export const partLevelOdds: Record<PartLevel, number> = {
  Normal: 75,
  Improved: 15,
  Rare: 7,
  Exotic: 3,
};

export const partLevelPriceMultipliers: Record<PartLevel, number> = {
  Normal: 0.631,
  Improved: 1.15,
  Rare: 1.4,
  Exotic: 2.2,
};

export const corePartKinds: readonly PartKind[] = [
  "receiver",
  "barrel",
  "magwell",
  "magazine",
  "pistolGrip",
];

export const accessoryPartKinds: readonly PartKind[] = [
  "optic",
  "laser",
  "flashlight",
  "muzzleDevice",
  "stock",
  "handguard",
  "frontGrip",
];
