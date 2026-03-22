import { describe, expect, it } from "vitest";

import { baseDimensionRanges, partDensities } from "../../core/constants";
import {
  partKinds,
  PartKind,
  weaponCategories,
  WeaponCategory,
} from "../../core/types";
import { sizeParts } from "../../generation/size-parts";
import { createPrng } from "../../random/prng";
import {
  FlashlightPart,
  MagazinePart,
  ReceiverPart,
  partConstructors,
} from "./factory";

function expectedWeightFor(kind: PartKind): number {
  const range = baseDimensionRanges[kind];
  return Number(range.minLength) * Number(range.minWidth) * partDensities[kind];
}

interface NumericRange {
  min: number;
  max: number;
}

interface PartRealismRange {
  lengthMm: NumericRange;
  widthMm: NumericRange;
  weightG: NumericRange;
}

const realisticRanges: Partial<Record<PartKind, PartRealismRange>> = {
  receiver: {
    lengthMm: { min: 100, max: 450 },
    widthMm: { min: 20, max: 200 },
    weightG: { min: 100, max: 2000 },
  },
};

function createSizedPart(
  kind: PartKind,
  category: WeaponCategory,
  seed: number,
) {
  const part = new partConstructors[kind](`${kind}-${category}-${seed}`);
  sizeParts([part], category, createPrng(seed));
  return part;
}

function expectInRange(
  value: number,
  range: NumericRange,
  label: string,
): void {
  expect(
    value,
    `${label} expected to be within ${range.min}-${range.max}, got ${value}`,
  ).toBeGreaterThanOrEqual(range.min);
  expect(
    value,
    `${label} expected to be within ${range.min}-${range.max}, got ${value}`,
  ).toBeLessThanOrEqual(range.max);
}

describe("part factory weights", () => {
  it("derives each part weight from its minimum dimensions and density", () => {
    for (const kind of partKinds) {
      const part = new partConstructors[kind](`${kind}-test`);

      expect(Number(part.weight)).toBeCloseTo(expectedWeightFor(kind), 10);
    }
  });

  it("defaults part levels to Normal and accepts explicit upgrades", () => {
    const receiver = new ReceiverPart("receiver-test");
    const flashlight = new FlashlightPart("flashlight-test", "Rare");

    expect(receiver.partLevel).toBe("Normal");
    expect(flashlight.partLevel).toBe("Rare");
  });

  it("keeps larger core parts heavier than small accessories", () => {
    const receiver = new ReceiverPart("receiver-test");
    const magazine = new MagazinePart("magazine-test");
    const flashlight = new FlashlightPart("flashlight-test");
    const frontGrip = new partConstructors.frontGrip("frontgrip-test");

    expect(Number(receiver.weight)).toBeGreaterThan(Number(magazine.weight));
    expect(Number(magazine.weight)).toBeGreaterThan(Number(flashlight.weight));
    expect(Number(flashlight.weight)).toBeGreaterThan(Number(frontGrip.weight));
  });

  it("keeps randomly generated part dimensions and weights within realistic ranges", () => {
    const sampleSeeds = [11, 97, 451, 1337, 9001];

    for (const kind of partKinds) {
      const configuredRange = realisticRanges[kind];
      if (!configuredRange) {
        continue;
      }

      for (const category of weaponCategories) {
        for (const seed of sampleSeeds) {
          const part = createSizedPart(kind, category, seed);

          expectInRange(
            Number(part.dimensionsMm.length),
            configuredRange.lengthMm,
            `${kind} length in ${category}`,
          );
          expectInRange(
            Number(part.dimensionsMm.width),
            configuredRange.widthMm,
            `${kind} width in ${category}`,
          );
          expectInRange(
            Number(part.weight),
            configuredRange.weightG,
            `${kind} weight in ${category}`,
          );
        }
      }
    }
  });
});
