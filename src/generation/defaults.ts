import { SeedBundle, WeaponCategory } from "../core/types";
import { randomSeedString } from "../random/seed";

export function createDefaultSeeds(
  category: WeaponCategory = "AssaultRifle",
): SeedBundle {
  return {
    category,
    dataModelSeed: randomSeedString(),
    partSizeSeed: randomSeedString(),
    aestheticDetailSeed: randomSeedString(),
  };
}
