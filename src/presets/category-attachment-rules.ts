import { corePartKinds } from "../core/constants";
import { CategoryPreset, WeaponCategory } from "../core/types";
import { categoryDimensionRules } from "./category-dimension-rules";
import { categoryAttachmentWeights } from "./category-probabilities";

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
    attachmentWeights: categoryAttachmentWeights.Pistol,
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
    attachmentWeights: categoryAttachmentWeights.SMG,
    dimensionOverrides: categoryDimensionRules.SMG,
    tags: ["compact", "pdw"],
  },
  Carbine: {
    category: "Carbine",
    requiredParts: corePartKinds,
    optionalParts: [...longGunParts],
    attachmentWeights: categoryAttachmentWeights.Carbine,
    dimensionOverrides: categoryDimensionRules.Carbine,
    tags: ["intermediate", "general-purpose"],
  },
  AssaultRifle: {
    category: "AssaultRifle",
    requiredParts: corePartKinds,
    optionalParts: [...longGunParts],
    attachmentWeights: categoryAttachmentWeights.AssaultRifle,
    dimensionOverrides: categoryDimensionRules.AssaultRifle,
    tags: ["service", "modular"],
  },
  BattleRifle: {
    category: "BattleRifle",
    requiredParts: corePartKinds,
    optionalParts: [...longGunParts],
    attachmentWeights: categoryAttachmentWeights.BattleRifle,
    dimensionOverrides: categoryDimensionRules.BattleRifle,
    tags: ["full-power", "robust"],
  },
  DMR: {
    category: "DMR",
    requiredParts: corePartKinds,
    optionalParts: [...longGunParts],
    attachmentWeights: categoryAttachmentWeights.DMR,
    dimensionOverrides: categoryDimensionRules.DMR,
    tags: ["precision", "support"],
  },
  Sniper: {
    category: "Sniper",
    requiredParts: corePartKinds,
    optionalParts: ["stock", "optic", "muzzleDevice", "handguard"],
    attachmentWeights: categoryAttachmentWeights.Sniper,
    dimensionOverrides: categoryDimensionRules.Sniper,
    tags: ["precision", "long-range"],
  },
};
