import { DimensionRangeMm, mm, PartKind, PartLevel } from "./types";

export const baseDimensionRanges: Record<PartKind, DimensionRangeMm> = {
  receiver: {
    minLength: mm(140),
    maxLength: mm(360),
    minWidth: mm(34),
    maxWidth: mm(82),
  },
  barrel: {
    minLength: mm(5),
    maxLength: mm(640),
    minWidth: mm(10),
    maxWidth: mm(25),
  },
  magwell: {
    minLength: mm(56),
    maxLength: mm(120),
    minWidth: mm(24),
    maxWidth: mm(58),
  },
  magazine: {
    minLength: mm(90),
    maxLength: mm(280),
    minWidth: mm(24),
    maxWidth: mm(52),
  },
  pistolGrip: {
    minLength: mm(76),
    maxLength: mm(140),
    minWidth: mm(26),
    maxWidth: mm(50),
  },
  handguard: {
    minLength: mm(0),
    maxLength: mm(420),
    minWidth: mm(30),
    maxWidth: mm(68),
  },
  stock: {
    minLength: mm(120),
    maxLength: mm(300),
    minWidth: mm(36),
    maxWidth: mm(80),
  },
  optic: {
    minLength: mm(36),
    maxLength: mm(180),
    minWidth: mm(24),
    maxWidth: mm(60),
  },
  laser: {
    minLength: mm(30),
    maxLength: mm(86),
    minWidth: mm(16),
    maxWidth: mm(34),
  },
  flashlight: {
    minLength: mm(56),
    maxLength: mm(120),
    minWidth: mm(18),
    maxWidth: mm(34),
  },
  muzzleDevice: {
    minLength: mm(20),
    maxLength: mm(120),
    minWidth: mm(16),
    maxWidth: mm(38),
  },
  frontGrip: {
    minLength: mm(40),
    maxLength: mm(118),
    minWidth: mm(18),
    maxWidth: mm(34),
  },
};

// These densities are not based on realistic materials, just chosen to output realistic masses based on the inaccurate dimensions.
export const partDensities: Record<PartKind, number> = {
  receiver: 0.04,
  barrel: 0.06,
  magwell: 0.04,
  magazine: 0.04,
  pistolGrip: 0.04,

  handguard: 0.05,
  stock: 0.05,
  optic: 0.05,
  laser: 0.05,
  flashlight: 0.05,
  muzzleDevice: 0.05,
  frontGrip: 0.05,
};

// These prices are not based on realistic materials, just chosen to output realistic prices based on the inaccurate dimensions.
export const partPricePerGramCents: Record<PartKind, number> = {
  receiver: 220,
  barrel: 180,
  magwell: 90,
  magazine: 65,
  pistolGrip: 75,
  handguard: 95,
  stock: 80,
  optic: 320,
  laser: 260,
  flashlight: 140,
  muzzleDevice: 160,
  frontGrip: 85,
};

// Weighted chances for part upgrade levels to appear
export const partLevelWeights: Record<PartLevel, number> = {
  Normal: 75,
  Improved: 15,
  Rare: 7,
  Exotic: 3,
};

export const partLevelPriceMultipliers: Record<PartLevel, number> = {
  Normal: 0.5,
  Improved: 1.2,
  Rare: 1.5,
  Exotic: 2.5,
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
