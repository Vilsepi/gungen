import { SeedBundle, WeaponCategory, weaponCategories } from "../core/types";
import { createDefaultSeeds } from "../generation/defaults";
import { generateWeapon } from "../generation/generate-weapon";
import { renderWeaponSvg } from "../render/weapon/render-weapon";

export interface RenderSvgInput {
  category?: string;
  dataModelSeed?: string;
  partSizeSeed?: string;
  aestheticDetailSeed?: string;
}

function isWeaponCategory(value: string | undefined): value is WeaponCategory {
  return (
    value !== undefined && weaponCategories.includes(value as WeaponCategory)
  );
}

export function resolveRenderSeeds(input: RenderSvgInput = {}): SeedBundle {
  if (input.category !== undefined && !isWeaponCategory(input.category)) {
    throw new Error(
      `Invalid category \"${input.category}\". Expected one of: ${weaponCategories.join(", ")}.`,
    );
  }

  const defaults = createDefaultSeeds(input.category);

  return {
    category: input.category ?? defaults.category,
    dataModelSeed: input.dataModelSeed ?? defaults.dataModelSeed,
    partSizeSeed: input.partSizeSeed ?? defaults.partSizeSeed,
    aestheticDetailSeed:
      input.aestheticDetailSeed ?? defaults.aestheticDetailSeed,
  };
}

export function renderSvgCanvas(input: RenderSvgInput = {}): string {
  const seeds = resolveRenderSeeds(input);
  const weapon = generateWeapon(seeds);
  return renderWeaponSvg(weapon, { debug: false }).trim();
}
