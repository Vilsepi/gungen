import { describe, expect, it } from "vitest";

import { Prng } from "./prng";
import { pickByOdds, pickOne } from "./pick";

function createCursorPrng(cursor: number): Prng {
  return {
    next() {
      return 0;
    },
    nextInt(minInclusive) {
      return minInclusive;
    },
    nextRange() {
      return cursor;
    },
    fork() {
      return createCursorPrng(cursor);
    },
  };
}

describe("pickOne", () => {
  it("throws when asked to pick from an empty list", () => {
    expect(() => pickOne(createCursorPrng(0), [])).toThrow(
      "Cannot pick from an empty list.",
    );
  });
});

describe("pickByOdds", () => {
  it("returns null when no positive odds are available", () => {
    expect(pickByOdds(createCursorPrng(0), { a: 0, b: -1 })).toBeNull();
  });

  it("selects the first bucket when the cursor lands inside it", () => {
    expect(
      pickByOdds(createCursorPrng(0.5), {
        alpha: 2,
        bravo: 3,
      }),
    ).toBe("alpha");
  });

  it("selects a later bucket after subtracting earlier odds", () => {
    expect(
      pickByOdds(createCursorPrng(2.5), {
        alpha: 2,
        bravo: 3,
        charlie: 5,
      }),
    ).toBe("bravo");
  });

  it("falls back to the final bucket when the cursor reaches the total", () => {
    expect(
      pickByOdds(createCursorPrng(10), {
        alpha: 2,
        bravo: 3,
        charlie: 5,
      }),
    ).toBe("charlie");
  });
});
