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
  magazine: (part, prng) => renderMagazine(part, prng),
  pistolGrip: (part) => renderPistolGrip(part),
  handguard: (part, prng) => renderHandguard(part, prng),
  stock: (part, prng) => renderStock(part, prng),
  optic: (part, prng) => renderOptic(part, prng),
  laser: (part) => renderLaser(part),
  flashlight: (part) => renderFlashlight(part),
  muzzleDevice: (part, prng) => renderMuzzleDevice(part, prng),
  frontGrip: (part) => renderFrontGrip(part),
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
      .part {
        --part-fill: rgba(44, 50, 56, 0.96);
        --part-stroke: rgba(196, 208, 217, 0.88);
        fill: var(--part-fill);
        stroke: var(--part-stroke);
        stroke-width: 2.15;
        stroke-linejoin: round;
        stroke-linecap: round;
      }
      .part line, .part path, .part rect, .part circle, .part ellipse, .part polygon {
        vector-effect: non-scaling-stroke;
      }
      .part .shell {
        fill: var(--part-fill);
        stroke: var(--part-stroke);
        stroke-width: 2.15;
      }
      .part .detail {
        fill: none;
        stroke: rgba(196, 208, 217, 0.78);
        stroke-width: 1.3;
      }
      .part .panel {
        fill: rgba(88, 99, 109, 0.22);
        stroke: rgba(192, 204, 214, 0.54);
        stroke-width: 1.1;
      }
      .part .shade {
        fill: rgba(14, 18, 23, 0.34);
        stroke: none;
      }
      .part .highlight {
        fill: none;
        stroke: rgba(235, 241, 245, 0.34);
        stroke-width: 1.05;
      }
      .part .pin {
        fill: rgba(189, 201, 210, 0.82);
        stroke: rgba(44, 50, 56, 0.44);
        stroke-width: 0.85;
      }
      .part .void {
        fill: rgba(8, 11, 15, 0.52);
        stroke: rgba(154, 167, 178, 0.34);
        stroke-width: 0.95;
      }
      .part .rail-notch {
        fill: rgba(184, 196, 206, 0.6);
        stroke: none;
      }
      .optic { --part-fill: rgba(146, 157, 167, 0.96); }
      .muzzle-device, .barrel { --part-fill: rgba(132, 142, 152, 0.96); }
      .laser, .flashlight { --part-fill: rgba(112, 124, 136, 0.96); }
      .debug { vector-effect: non-scaling-stroke; }
    </style>
    ${content}
    ${debug}
  `;
  return createSvgDocument(weapon.bounds, drawing);
}
