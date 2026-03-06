import { THEMES } from '../model/constants.js';
import { buildWeaponLayout, validateLayout } from '../layout/buildWeaponLayout.js';
import { generateWeaponSpec, validateWeaponSpec } from '../model/specGenerator.js';

export function generateRenderableWeapon(seedText, requestedClass) {
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const attemptSeed = attempt === 0 ? seedText : `${seedText}#${attempt}`;
    const spec = generateWeaponSpec(attemptSeed, requestedClass);
    if (!validateWeaponSpec(spec)) {
      continue;
    }

    const layout = buildWeaponLayout(spec, THEMES);
    if (validateLayout(layout)) {
      return {
        spec: { ...spec, seed: seedText },
        layout,
      };
    }
  }

  const fallbackSpec = generateWeaponSpec(`${seedText}#fallback`, requestedClass);
  const fallbackLayout = buildWeaponLayout(fallbackSpec, THEMES);
  return {
    spec: { ...fallbackSpec, seed: seedText },
    layout: fallbackLayout,
  };
}
