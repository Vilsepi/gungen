import { describe, expect, it } from "vitest";

import { Prng } from "../random/prng";
import { selectAttachments } from "./select-attachments";

function createSequencePrng(values: number[]): Prng {
  let index = 0;

  const nextValue = () => {
    const fallback = values.at(-1) ?? 0;
    const value = values[index] ?? fallback;
    index += 1;
    return value;
  };

  return {
    next() {
      return nextValue();
    },
    nextInt(minInclusive, maxInclusive) {
      return Math.floor(
        minInclusive + (maxInclusive - minInclusive + 1) * nextValue(),
      );
    },
    nextRange(minInclusive, maxInclusive) {
      return minInclusive + (maxInclusive - minInclusive) * nextValue();
    },
    fork() {
      return createSequencePrng(values.slice(index));
    },
  };
}

describe("selectAttachments", () => {
  it("keeps pistols free of forced stock attachments", () => {
    expect(selectAttachments("Pistol", createSequencePrng([0.99]))).toEqual([]);
  });

  it("forces a handguard when a rail accessory is selected", () => {
    const selected = selectAttachments(
      "SMG",
      createSequencePrng([0.99, 0.99, 0.1, 0.99, 0.99, 0.99, 0.99]),
    );

    expect(selected).toContain("laser");
    expect(selected).toContain("handguard");
    expect(selected).toContain("stock");
    expect(selected).not.toContain("flashlight");
    expect(selected).not.toContain("frontGrip");
  });

  it("forces an optic for DMRs when the optic roll fails", () => {
    const selected = selectAttachments("DMR", createSequencePrng([0.99]));

    expect(selected).toContain("stock");
    expect(selected).toContain("handguard");
    expect(selected).toContain("optic");
    expect(selected).not.toContain("laser");
    expect(selected).not.toContain("flashlight");
  });
});
