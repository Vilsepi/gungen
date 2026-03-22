import { describe, expect, it } from "vitest";

import { LayoutPart } from "../../core/types";
import { Prng } from "../../random/prng";
import { renderMagazine } from "./render-magazine";

function createStubPrng(values: number[]): Prng {
  let index = 0;
  const nextValue = (): number => values[index++] ?? 0;

  return {
    next: nextValue,
    nextInt(minInclusive, maxInclusive) {
      return Math.floor(this.nextRange(minInclusive, maxInclusive + 1));
    },
    nextRange(minInclusive, maxInclusive) {
      return minInclusive + (maxInclusive - minInclusive) * this.next();
    },
    fork() {
      return createStubPrng(values.slice(index));
    },
  };
}

describe("renderMagazine", () => {
  it("curves rifle magazines toward the rear in local coordinates", () => {
    const part: LayoutPart = {
      partId: "magazine-test",
      kind: "magazine",
      partLevel: "Normal",
      x: 0,
      y: 0,
      rotationDeg: 0,
      sizeX: 20,
      sizeY: 60,
      anchors: {},
    };

    const markup = renderMagazine(
      part,
      createStubPrng([0.9, 0]),
      "AssaultRifle",
    );

    expect(markup).toContain("Q -30 0 -50 30");
    expect(markup).toContain("Q -50 0 -10 -30");
    expect(markup).not.toContain("Q 50 0 10 -30");
    expect(markup).toContain('transform="rotate(-45 0 -30)"');
  });
});
