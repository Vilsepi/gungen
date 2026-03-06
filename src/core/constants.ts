import { DimensionRangeMm, mm, PartKind } from "./types";

export const baseDimensionRanges: Record<PartKind, DimensionRangeMm> = {
  receiver: {
    minLength: mm(140),
    maxLength: mm(360),
    minWidth: mm(34),
    maxWidth: mm(82),
  },
  barrel: {
    minLength: mm(70),
    maxLength: mm(640),
    minWidth: mm(12),
    maxWidth: mm(28),
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
    maxWidth: mm(42),
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
  handStop: {
    minLength: mm(18),
    maxLength: mm(58),
    minWidth: mm(10),
    maxWidth: mm(26),
  },
};

export const partDensities: Record<PartKind, number> = {
  receiver: 0.012,
  barrel: 0.01,
  magwell: 0.011,
  magazine: 0.009,
  pistolGrip: 0.007,
  handguard: 0.008,
  stock: 0.007,
  optic: 0.009,
  laser: 0.006,
  flashlight: 0.006,
  muzzleDevice: 0.01,
  frontGrip: 0.007,
  handStop: 0.006,
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
  "handStop",
];
