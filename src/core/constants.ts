import { DimensionRangeMm, mm, PartKind, PartLevel } from "./types";

export const baseDimensionRanges: Record<PartKind, DimensionRangeMm> = {
  receiver: {
    minLength: mm(140),
    maxLength: mm(340),
    minWidth: mm(32),
    maxWidth: mm(62),
  },
  barrel: {
    minLength: mm(60),
    maxLength: mm(620),
    minWidth: mm(12),
    maxWidth: mm(24),
  },
  magwell: {
    minLength: mm(48),
    maxLength: mm(96),
    minWidth: mm(24),
    maxWidth: mm(38),
  },
  magazine: {
    minLength: mm(90),
    maxLength: mm(250),
    minWidth: mm(18),
    maxWidth: mm(36),
  },
  pistolGrip: {
    minLength: mm(82),
    maxLength: mm(125),
    minWidth: mm(24),
    maxWidth: mm(36),
  },
  handguard: {
    minLength: mm(0),
    maxLength: mm(360),
    minWidth: mm(32),
    maxWidth: mm(56),
  },
  stock: {
    minLength: mm(120),
    maxLength: mm(290),
    minWidth: mm(40),
    maxWidth: mm(70),
  },
  optic: {
    minLength: mm(36),
    maxLength: mm(185),
    minWidth: mm(20),
    maxWidth: mm(48),
  },
  laser: {
    minLength: mm(35),
    maxLength: mm(80),
    minWidth: mm(14),
    maxWidth: mm(28),
  },
  flashlight: {
    minLength: mm(55),
    maxLength: mm(120),
    minWidth: mm(16),
    maxWidth: mm(30),
  },
  muzzleDevice: {
    minLength: mm(15),
    maxLength: mm(70),
    minWidth: mm(14),
    maxWidth: mm(34),
  },
  frontGrip: {
    minLength: mm(45),
    maxLength: mm(100),
    minWidth: mm(20),
    maxWidth: mm(34),
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
