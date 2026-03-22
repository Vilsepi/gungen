export const weaponCategories = [
  "Pistol",
  "SMG",
  "Carbine",
  "AssaultRifle",
  "BattleRifle",
  "DMR",
  "Sniper",
] as const;

export type WeaponCategory = (typeof weaponCategories)[number];

export const partKinds = [
  "receiver",
  "barrel",
  "magwell",
  "magazine",
  "pistolGrip",
  "handguard",
  "stock",
  "optic",
  "laser",
  "flashlight",
  "muzzleDevice",
  "frontGrip",
] as const;

export type PartKind = (typeof partKinds)[number];

export const partLevels = ["Normal", "Improved", "Rare", "Exotic"] as const;

export type PartLevel = (typeof partLevels)[number];

export const attachmentPointKinds = [
  "top",
  "bottom",
  "front",
  "rear",
  "barrelStart",
  "barrelEnd",
  "magIn",
  "magOut",
  "side",
] as const;

export type AttachmentPointKind = (typeof attachmentPointKinds)[number];

type Brand<T, Name extends string> = T & { readonly __brand: Name };

export type Millimeters = Brand<number, "Millimeters">;
export type SquareMillimeters = Brand<number, "SquareMillimeters">;
export type Grams = Brand<number, "Grams">;
export type Cents = Brand<number, "Cents">;

export interface DimensionsMm {
  length: Millimeters;
  width: Millimeters;
}

export interface DimensionRangeMm {
  minLength: Millimeters;
  maxLength: Millimeters;
  minWidth: Millimeters;
  maxWidth: Millimeters;
}

export interface AttachmentPointSpec {
  id: string;
  kind: AttachmentPointKind;
  allowedPartKinds: readonly PartKind[];
  maxConnections: number;
}

export interface Connection {
  fromPartId: string;
  fromPointId: string;
  toPartId: string;
  toPointId: string;
}

export interface SeedBundle {
  category: WeaponCategory;
  dataModelSeed: string;
  partSizeSeed: string;
  aestheticDetailSeed: string;
}

export interface LayoutAnchor {
  x: number;
  y: number;
}

export interface LayoutPart {
  partId: string;
  kind: PartKind;
  partLevel: PartLevel;
  x: number;
  y: number;
  rotationDeg: number;
  length: number;
  width: number;
  anchors: Record<string, LayoutAnchor>;
}

export interface LayoutBounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

export interface WeaponMetrics {
  totalMass: Grams;
  totalPrice: Cents;
  totalLength: Millimeters;
  totalHeight: Millimeters;
}

export interface RenderDetailContext {
  partId: string;
  debug: boolean;
}

export interface CategoryPreset {
  category: WeaponCategory;
  requiredParts: readonly PartKind[];
  optionalParts: readonly PartKind[];
  attachmentOdds: Partial<Record<PartKind, number>>;
  dimensionOverrides: Partial<Record<PartKind, Partial<DimensionRangeMm>>>;
  tags: readonly string[];
}

export interface WeaponSummaryItem {
  id: string;
  kind: PartKind;
  partLevel: PartLevel;
  displayName: string;
  length: number;
  width: number;
  mass: number;
}

export function mm(value: number): Millimeters {
  return value as Millimeters;
}

export function mm2(value: number): SquareMillimeters {
  return value as SquareMillimeters;
}

export function grams(value: number): Grams {
  return value as Grams;
}

export function cents(value: number): Cents {
  return value as Cents;
}
