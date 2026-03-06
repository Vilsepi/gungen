import { describe, expect, it } from "vitest";

import { partPricePerGramCents } from "../core/constants";
import {
  BarrelPart,
  MagwellPart,
  MagazinePart,
  OpticPart,
  PistolGripPart,
  ReceiverPart,
} from "../domain/parts/factory";
import { layoutWeapon } from "./layout-weapon";

describe("layoutWeapon pricing", () => {
  it("sums total price from each part weight and kind multiplier", () => {
    const parts = [
      new ReceiverPart("receiver-test"),
      new BarrelPart("barrel-test"),
      new MagwellPart("magwell-test"),
      new MagazinePart("magazine-test"),
      new PistolGripPart("pistol-grip-test"),
      new OpticPart("optic-test"),
    ];

    const result = layoutWeapon(parts);
    const expectedTotalWeight = parts.reduce(
      (sum, part) => sum + Number(part.weight),
      0,
    );
    const expectedTotalPrice = parts.reduce(
      (sum, part) =>
        sum +
        Math.round(Number(part.weight) * partPricePerGramCents[part.kind]),
      0,
    );

    expect(Number(result.metrics.totalWeight)).toBeCloseTo(
      expectedTotalWeight,
      10,
    );
    expect(Number(result.metrics.totalPrice)).toBe(expectedTotalPrice);
  });
});
