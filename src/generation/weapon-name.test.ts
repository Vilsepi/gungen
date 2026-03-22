import { describe, expect, it } from "vitest";

import { SeedBundle } from "../core/types";
import { createWeaponName } from "./weapon-name";

describe("createWeaponName", () => {
  it("uses the expected category prefix", () => {
    const seeds: SeedBundle = {
      category: "AssaultRifle",
      dataModelSeed: "alpha",
      partSizeSeed: "bravo",
      aestheticDetailSeed: "charlie",
    };

    expect(createWeaponName(seeds)).toMatch(/^AR-/u);
  });

  it("produces a deterministic ASCII hash from all three seed hashes", () => {
    const seeds: SeedBundle = {
      category: "SMG",
      dataModelSeed: "alpha",
      partSizeSeed: "bravo",
      aestheticDetailSeed: "charlie",
    };

    expect(createWeaponName(seeds)).toBe("MP-4C3HAUI");
  });

  it("uses only uppercase letters, digits, and a single dash", () => {
    const seeds: SeedBundle = {
      category: "Pistol",
      dataModelSeed: "alpha",
      partSizeSeed: "bravo",
      aestheticDetailSeed: "charlie",
    };

    expect(createWeaponName(seeds)).toMatch(/^[A-Z0-9]+-[A-Z0-9]+$/u);
  });

  it("changes when any seed changes", () => {
    const baseSeeds: SeedBundle = {
      category: "DMR",
      dataModelSeed: "alpha",
      partSizeSeed: "bravo",
      aestheticDetailSeed: "charlie",
    };

    const changedSeeds: SeedBundle = {
      ...baseSeeds,
      aestheticDetailSeed: "delta",
    };

    expect(createWeaponName(baseSeeds)).not.toBe(
      createWeaponName(changedSeeds),
    );
  });

  it("keeps the suffix compact", () => {
    const seeds: SeedBundle = {
      category: "Sniper",
      dataModelSeed: "alpha",
      partSizeSeed: "bravo",
      aestheticDetailSeed: "charlie",
    };

    expect(createWeaponName(seeds)).toMatch(/^S-[A-Z0-9]{7}$/u);
  });
});
