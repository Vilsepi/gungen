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
  it("renders the current curved rifle magazine profile", () => {
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

    expect(markup).toContain("Q -5 0 20 30");
    expect(markup).toContain("L 0 30");
    expect(markup).toContain("Q -25 0 -10 -30");
    expect(markup).not.toContain("Q 50 0 10 -30");
    expect(markup).toContain('transform="rotate(0 0 -30)"');
  });
});
