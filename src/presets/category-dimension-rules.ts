import { CategoryPreset, mm } from "../core/types";

export const categoryDimensionRules: Record<
  CategoryPreset["category"],
  CategoryPreset["dimensionOverrides"]
> = {
  Pistol: {
    receiver: { minLength: mm(140), maxLength: mm(220) },
    barrel: { minLength: mm(70), maxLength: mm(140) },
    handguard: { minLength: mm(0), maxLength: mm(100) },
    stock: { minLength: mm(0), maxLength: mm(0) },
  },
  SMG: {
    receiver: { minLength: mm(180), maxLength: mm(280) },
    barrel: { minLength: mm(120), maxLength: mm(240) },
    handguard: { minLength: mm(80), maxLength: mm(190) },
    stock: { minLength: mm(120), maxLength: mm(220) },
  },
  Carbine: {
    receiver: { minLength: mm(220), maxLength: mm(320) },
    barrel: { minLength: mm(240), maxLength: mm(380) },
    handguard: { minLength: mm(180), maxLength: mm(300) },
  },
  AssaultRifle: {
    receiver: { minLength: mm(230), maxLength: mm(330) },
    barrel: { minLength: mm(280), maxLength: mm(420) },
    handguard: { minLength: mm(200), maxLength: mm(400) },
    stock: { minLength: mm(180), maxLength: mm(280) },
  },
  BattleRifle: {
    receiver: { minLength: mm(250), maxLength: mm(360) },
    barrel: { minLength: mm(360), maxLength: mm(520) },
    handguard: { minLength: mm(220), maxLength: mm(360) },
    stock: { minLength: mm(180), maxLength: mm(300) },
  },
  DMR: {
    receiver: { minLength: mm(250), maxLength: mm(370) },
    barrel: { minLength: mm(420), maxLength: mm(580) },
    handguard: { minLength: mm(240), maxLength: mm(380) },
    optic: { minLength: mm(100), maxLength: mm(180) },
    stock: { minLength: mm(190), maxLength: mm(300) },
  },
  Sniper: {
    receiver: { minLength: mm(280), maxLength: mm(420) },
    barrel: { minLength: mm(500), maxLength: mm(640) },
    handguard: { minLength: mm(240), maxLength: mm(390) },
    optic: { minLength: mm(130), maxLength: mm(180) },
    stock: { minLength: mm(220), maxLength: mm(300) },
  },
};
