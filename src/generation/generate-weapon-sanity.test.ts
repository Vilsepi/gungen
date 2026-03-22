import { describe, it } from "vitest";

import { SeedBundle, WeaponCategory, weaponCategories } from "../core/types";
import { generateWeapon } from "./generate-weapon";

interface MetricBounds {
  minPriceUsd: number;
  maxPriceUsd: number;
  minMassGrams: number;
  maxMassGrams: number;
  minSizeXMm: number;
  maxSizeXMm: number;
}

const categoryMetricBounds: Record<WeaponCategory, MetricBounds> = {
  Pistol: {
    minPriceUsd: 500,
    maxPriceUsd: 3500,
    minMassGrams: 500,
    maxMassGrams: 2000,
    minSizeXMm: 150,
    maxSizeXMm: 500,
  },
  SMG: {
    minPriceUsd: 1000,
    maxPriceUsd: 4500,
    minMassGrams: 1800,
    maxMassGrams: 3500,
    minSizeXMm: 350,
    maxSizeXMm: 700,
  },
  Carbine: {
    minPriceUsd: 800,
    maxPriceUsd: 4000,
    minMassGrams: 2500,
    maxMassGrams: 4200,
    minSizeXMm: 550,
    maxSizeXMm: 900,
  },
  AssaultRifle: {
    minPriceUsd: 1200,
    maxPriceUsd: 4500,
    minMassGrams: 3000,
    maxMassGrams: 5000,
    minSizeXMm: 680,
    maxSizeXMm: 1030,
  },
  BattleRifle: {
    minPriceUsd: 2000,
    maxPriceUsd: 5500,
    minMassGrams: 3500,
    maxMassGrams: 5000,
    minSizeXMm: 750,
    maxSizeXMm: 1100,
  },
  DMR: {
    minPriceUsd: 2000,
    maxPriceUsd: 7000,
    minMassGrams: 3500,
    maxMassGrams: 6500,
    minSizeXMm: 850,
    maxSizeXMm: 1200,
  },
  Sniper: {
    minPriceUsd: 3000,
    maxPriceUsd: 15000,
    minMassGrams: 4000,
    maxMassGrams: 15000,
    minSizeXMm: 1000,
    maxSizeXMm: 1400,
  },
};

const sampleCountPerCategory = 32;

function createSeedBundle(category: WeaponCategory, index: number): SeedBundle {
  return {
    category,
    dataModelSeed: `${category}-data-${index}`,
    partSizeSeed: `${category}-size-${index}`,
    aestheticDetailSeed: `${category}-detail-${index}`,
  };
}

function assertNoViolations(violations: string[]): void {
  if (violations.length > 0) {
    throw new Error(violations.join("\n"));
  }
}

describe("generateWeapon sanity checks", () => {
  for (const category of weaponCategories) {
    it(`${category} samples always contain exactly one receiver, pistol grip, and barrel`, () => {
      const violations: string[] = [];

      for (let index = 0; index < sampleCountPerCategory; index += 1) {
        const seedBundle = createSeedBundle(category, index);
        const weapon = generateWeapon(seedBundle);

        for (const kind of ["receiver", "pistolGrip", "barrel"] as const) {
          const count = weapon.parts.filter(
            (part) => part.kind === kind,
          ).length;
          if (count !== 1) {
            violations.push(
              `${category} seed ${index} expected exactly one ${kind} but found ${count}.`,
            );
          }
        }
      }

      assertNoViolations(violations);
    });

    it(`${category} samples stay within documented mass, price, and sizeX bounds`, () => {
      const bounds = categoryMetricBounds[category];
      const violations: string[] = [];

      for (let index = 0; index < sampleCountPerCategory; index += 1) {
        const seedBundle = createSeedBundle(category, index);
        const weapon = generateWeapon(seedBundle);
        const priceUsd = Number(weapon.metrics.totalPrice) / 100;
        const massGrams = Number(weapon.metrics.totalMass);
        const sizeXMm = Number(weapon.metrics.totalSizeX);

        if (priceUsd < bounds.minPriceUsd || priceUsd > bounds.maxPriceUsd) {
          violations.push(
            `${category} seed ${index} price ${priceUsd.toFixed(2)} USD is outside ${bounds.minPriceUsd}-${bounds.maxPriceUsd} USD.`,
          );
        }

        if (
          massGrams < bounds.minMassGrams ||
          massGrams > bounds.maxMassGrams
        ) {
          violations.push(
            `${category} seed ${index} mass ${massGrams.toFixed(2)} g is outside ${bounds.minMassGrams}-${bounds.maxMassGrams} g.`,
          );
        }

        if (sizeXMm < bounds.minSizeXMm || sizeXMm > bounds.maxSizeXMm) {
          violations.push(
            `${category} seed ${index} sizeX ${sizeXMm.toFixed(2)} mm is outside ${bounds.minSizeXMm}-${bounds.maxSizeXMm} mm.`,
          );
        }
      }

      assertNoViolations(violations);
    });
  }
});
