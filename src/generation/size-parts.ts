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
    minLength: override?.minLength ?? base.minLength,
    maxLength: override?.maxLength ?? base.maxLength,
    minWidth: override?.minWidth ?? base.minWidth,
    maxWidth: override?.maxWidth ?? base.maxWidth,
  };
}

function resolveDimensions(range: DimensionRangeMm, prng: Prng): DimensionsMm {
  return {
    length: mm(
      rangeFloat(prng, Number(range.minLength), Number(range.maxLength)),
    ),
    width: mm(rangeFloat(prng, Number(range.minWidth), Number(range.maxWidth))),
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
    part.area = computeArea(
      Number(dimensions.length),
      Number(dimensions.width),
    );
    part.mass = computeMass(part.area, part.density);
  }
}
