import { PartKind } from "../../core/types";
import { Weapon } from "../../domain/bom/weapon";
import { createPrng } from "../../random/prng";
import { hashString } from "../../random/hash";
import { normalizeSeed } from "../../random/seed";
import { createSvgDocument } from "../svg/svg-document";
import { renderBarrel } from "../parts/render-barrel";
import { renderFlashlight } from "../parts/render-flashlight";
import { renderFrontGrip } from "../parts/render-front-grip";
import { renderHandguard } from "../parts/render-handguard";
import { renderHandStop } from "../parts/render-hand-stop";
import { renderLaser } from "../parts/render-laser";
import { renderMagazine } from "../parts/render-magazine";
import { renderMagwell } from "../parts/render-magwell";
import { renderMuzzleDevice } from "../parts/render-muzzle-device";
import { renderOptic } from "../parts/render-optic";
import { renderPistolGrip } from "../parts/render-pistol-grip";
import { renderReceiver } from "../parts/render-receiver";
import { renderStock } from "../parts/render-stock";
import { renderOrder } from "./render-layering";
import { renderDebug } from "./render-debug";

type PartRenderer = (
  markup: Weapon["layout"][number],
  seed: ReturnType<typeof createPrng>,
) => string;

const renderers: Record<PartKind, PartRenderer> = {
  receiver: (part, prng) => renderReceiver(part, prng),
  barrel: (part) => renderBarrel(part),
  magwell: (part) => renderMagwell(part),
  magazine: (part) => renderMagazine(part),
  pistolGrip: (part) => renderPistolGrip(part),
  handguard: (part, prng) => renderHandguard(part, prng),
  stock: (part) => renderStock(part),
  optic: (part) => renderOptic(part),
  laser: (part) => renderLaser(part),
  flashlight: (part) => renderFlashlight(part),
  muzzleDevice: (part, prng) => renderMuzzleDevice(part, prng),
  frontGrip: (part) => renderFrontGrip(part),
  handStop: (part) => renderHandStop(part),
};

export function renderWeaponSvg(
  weapon: Weapon,
  options: { debug: boolean },
): string {
  const partByKind = new Map(weapon.layout.map((part) => [part.kind, part]));
  const baseSeed = normalizeSeed(weapon.seedBundle.aestheticDetailSeed);
  const content = renderOrder
    .map((kind) => {
      const part = partByKind.get(kind);
      if (!part) {
        return "";
      }
      const prng = createPrng(baseSeed ^ hashString(part.partId));
      return renderers[kind](part, prng);
    })
    .join("");

  const debug = options.debug ? renderDebug(weapon.layout) : "";
  const drawing = `
    <style>
      .part { fill: rgba(60, 75, 89, 0.94); stroke: #a9d7fb; stroke-width: 2.4; stroke-linejoin: round; stroke-linecap: round; }
      .part line, .part path, .part rect, .part circle { vector-effect: non-scaling-stroke; }
      .optic { fill: rgba(92, 111, 126, 0.94); }
      .muzzle-device, .barrel { fill: rgba(74, 91, 108, 0.94); }
      .laser, .flashlight { fill: rgba(82, 101, 118, 0.95); }
      .debug { vector-effect: non-scaling-stroke; }
    </style>
    ${content}
    ${debug}
  `;
  return createSvgDocument(weapon.bounds, drawing);
}
