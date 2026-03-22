import { corePartKinds } from "../core/constants";
import { CategoryPreset, WeaponCategory } from "../core/types";
import { categoryDimensionRules } from "./category-dimension-rules";
import { categoryAttachmentOdds } from "./category-probabilities";

const longGunParts = [
  ...corePartKinds,
  "stock",
  "handguard",
  "optic",
  "laser",
  "flashlight",
  "muzzleDevice",
  "frontGrip",
] as const;

export const categoryPresets: Record<WeaponCategory, CategoryPreset> = {
  Pistol: {
    category: "Pistol",
    requiredParts: corePartKinds,
    optionalParts: [
      "optic",
      "laser",
      "flashlight",
      "muzzleDevice",
      "handguard",
    ],
    attachmentOdds: categoryAttachmentOdds.Pistol,
    dimensionOverrides: categoryDimensionRules.Pistol,
    tags: ["compact", "sidearm"],
  },
  SMG: {
    category: "SMG",
    requiredParts: corePartKinds,
    optionalParts: [
      "stock",
      "optic",
      "laser",
      "flashlight",
      "muzzleDevice",
      "handguard",
      "frontGrip",
    ],
    attachmentOdds: categoryAttachmentOdds.SMG,
    dimensionOverrides: categoryDimensionRules.SMG,
    tags: ["compact", "pdw"],
  },
  Carbine: {
    category: "Carbine",
    requiredParts: corePartKinds,
    optionalParts: [...longGunParts],
    attachmentOdds: categoryAttachmentOdds.Carbine,
    dimensionOverrides: categoryDimensionRules.Carbine,
    tags: ["intermediate", "general-purpose"],
  },
  AssaultRifle: {
    category: "AssaultRifle",
    requiredParts: corePartKinds,
    optionalParts: [...longGunParts],
    attachmentOdds: categoryAttachmentOdds.AssaultRifle,
    dimensionOverrides: categoryDimensionRules.AssaultRifle,
    tags: ["service", "modular"],
  },
  BattleRifle: {
    category: "BattleRifle",
    requiredParts: corePartKinds,
    optionalParts: [...longGunParts],
    attachmentOdds: categoryAttachmentOdds.BattleRifle,
    dimensionOverrides: categoryDimensionRules.BattleRifle,
    tags: ["full-power", "robust"],
  },
  DMR: {
    category: "DMR",
    requiredParts: corePartKinds,
    optionalParts: [...longGunParts],
    attachmentOdds: categoryAttachmentOdds.DMR,
    dimensionOverrides: categoryDimensionRules.DMR,
    tags: ["precision", "support"],
  },
  Sniper: {
    category: "Sniper",
    requiredParts: corePartKinds,
    optionalParts: ["stock", "optic", "muzzleDevice", "handguard"],
    attachmentOdds: categoryAttachmentOdds.Sniper,
    dimensionOverrides: categoryDimensionRules.Sniper,
    tags: ["precision", "long-range"],
  },
};
