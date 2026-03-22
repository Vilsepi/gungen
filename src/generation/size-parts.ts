import { baseDimensionRanges } from "../core/constants";
import {
  DimensionRangeMm,
  DimensionsMm,
  mm,
  PartKind,
  WeaponCategory,
} from "../core/types";
import { Part } from "../domain/parts";
import { computeArea, computeMass } from "../domain/physics/mass";
import { rangeFloat } from "../random/pick";
import { Prng } from "../random/prng";
import { categoryPresets } from "../presets/category-attachment-rules";

function resolveRange(
  kind: PartKind,
  category: WeaponCategory,
): DimensionRangeMm {
  const base = baseDimensionRanges[kind];
  const override = categoryPresets[category].dimensionOverrides[kind];
  return {
    minSizeX: override?.minSizeX ?? base.minSizeX,
    maxSizeX: override?.maxSizeX ?? base.maxSizeX,
    minSizeY: override?.minSizeY ?? base.minSizeY,
    maxSizeY: override?.maxSizeY ?? base.maxSizeY,
  };
}

function resolveDimensions(range: DimensionRangeMm, prng: Prng): DimensionsMm {
  return {
    sizeX: mm(rangeFloat(prng, Number(range.minSizeX), Number(range.maxSizeX))),
    sizeY: mm(rangeFloat(prng, Number(range.minSizeY), Number(range.maxSizeY))),
  };
}

export function sizeParts(
  parts: Part[],
  category: WeaponCategory,
  prng: Prng,
): void {
  for (const part of parts) {
    const range = resolveRange(part.kind, category);
    const dimensions = resolveDimensions(
      range,
      prng.fork(part.id.length * 2654435761),
    );
    part.dimensionsMm = dimensions;
    part.area = computeArea(Number(dimensions.sizeX), Number(dimensions.sizeY));
    part.mass = computeMass(part.area, part.density);
  }
}
