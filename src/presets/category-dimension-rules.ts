import { CategoryPreset, mm } from "../core/types";

export const categoryDimensionRules: Record<
  CategoryPreset["category"],
  CategoryPreset["dimensionOverrides"]
> = {
  Pistol: {
    receiver: { minLength: mm(145), maxLength: mm(210) },
    barrel: { minLength: mm(75), maxLength: mm(135) },
    handguard: { minLength: mm(0), maxLength: mm(80) },
    optic: {
      minLength: mm(32),
      maxLength: mm(72),
      minWidth: mm(20),
      maxWidth: mm(34),
    },
    stock: { minLength: mm(0), maxLength: mm(0) },
  },
  SMG: {
    receiver: { minLength: mm(185), maxLength: mm(290) },
    barrel: { minLength: mm(110), maxLength: mm(240) },
    handguard: { minLength: mm(60), maxLength: mm(180) },
    optic: {
      minLength: mm(42),
      maxLength: mm(96),
      minWidth: mm(22),
      maxWidth: mm(38),
    },
    stock: { minLength: mm(135), maxLength: mm(250) },
  },
  Carbine: {
    receiver: { minLength: mm(220), maxLength: mm(305) },
    barrel: { minLength: mm(250), maxLength: mm(385) },
    handguard: { minLength: mm(160), maxLength: mm(290) },
    optic: {
      minLength: mm(50),
      maxLength: mm(118),
      minWidth: mm(24),
      maxWidth: mm(40),
    },
    stock: { minLength: mm(170), maxLength: mm(270) },
  },
  AssaultRifle: {
    receiver: { minLength: mm(230), maxLength: mm(325) },
    barrel: { minLength: mm(300), maxLength: mm(460) },
    handguard: { minLength: mm(180), maxLength: mm(340) },
    optic: {
      minLength: mm(54),
      maxLength: mm(124),
      minWidth: mm(24),
      maxWidth: mm(42),
    },
    stock: { minLength: mm(185), maxLength: mm(285) },
  },
  BattleRifle: {
    receiver: { minLength: mm(245), maxLength: mm(350) },
    barrel: { minLength: mm(340), maxLength: mm(540) },
    handguard: { minLength: mm(200), maxLength: mm(340) },
    optic: {
      minLength: mm(62),
      maxLength: mm(138),
      minWidth: mm(24),
      maxWidth: mm(44),
    },
    stock: { minLength: mm(190), maxLength: mm(285) },
  },
  DMR: {
    receiver: { minLength: mm(250), maxLength: mm(360) },
    barrel: { minLength: mm(440), maxLength: mm(620) },
    handguard: { minLength: mm(220), maxLength: mm(360) },
    optic: { minLength: mm(110), maxLength: mm(180) },
    stock: { minLength: mm(200), maxLength: mm(290) },
  },
  Sniper: {
    receiver: { minLength: mm(290), maxLength: mm(390) },
    barrel: { minLength: mm(540), maxLength: mm(640) },
    handguard: { minLength: mm(240), maxLength: mm(380) },
    optic: { minLength: mm(140), maxLength: mm(180) },
    stock: { minLength: mm(230), maxLength: mm(300) },
  },
};
