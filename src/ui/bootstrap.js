import { createSeed } from '../core/random.js';
import { generateRenderableWeapon } from '../app/generateWeapon.js';
import { renderWeaponSvg } from '../render/renderWeaponSvg.js';
import { updateMeta } from './meta.js';

function getRequiredElement(id) {
  const element = document.getElementById(id);
  if (!element) {
    throw new Error(`Missing required element: ${id}`);
  }
  return element;
}

export function bootstrapApp() {
  if (typeof document === 'undefined') {
    return;
  }

  const svg = getRequiredElement('weaponSvg');
  const weaponClass = getRequiredElement('weaponClass');
  const seedInput = getRequiredElement('seedInput');
  const randomizeButton = getRequiredElement('randomizeButton');
  const classPill = getRequiredElement('classPill');
  const seedPill = getRequiredElement('seedPill');
  const attachmentPill = getRequiredElement('attachmentPill');
  const elements = { classPill, seedPill, attachmentPill };

  function renderFromSeed(seedText) {
    const { spec, layout } = generateRenderableWeapon(seedText, weaponClass.value);
    renderWeaponSvg(svg, layout);
    updateMeta(spec, elements);
  }

  function randomize() {
    const seed = createSeed();
    seedInput.value = seed;
    renderFromSeed(seed);
  }

  randomizeButton.addEventListener('click', randomize);

  weaponClass.addEventListener('change', () => {
    const seed = seedInput.value.trim() || createSeed();
    seedInput.value = seed;
    renderFromSeed(seed);
  });

  seedInput.addEventListener('change', () => {
    const seed = seedInput.value.trim();
    if (seed) {
      renderFromSeed(seed);
    }
  });

  seedInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      const seed = seedInput.value.trim() || createSeed();
      seedInput.value = seed;
      renderFromSeed(seed);
    }
  });

  randomize();
}
