import { LayoutPart, WeaponCategory } from "../../core/types";
import { pickOne, rangeFloat, rangeInt } from "../../random/pick";
import { Prng } from "../../random/prng";
import { renderPartGroup } from "./shared";

export function renderMagazine(
  part: LayoutPart,
  prng: Prng,
  category: WeaponCategory,
): string {
  // Pistols always use straight magazines; long guns allow all profiles.
  const profileChoices =
    category === "Pistol"
      ? (["straight"] as const)
      : (["straight", "angled", "curved"] as const);
  const profile = pickOne(prng, profileChoices);
  const ribs = rangeInt(prng, 3, 6);
  const left = -part.sizeY / 2;
  const right = part.sizeY / 2;
  const top = -part.sizeX / 2;
  const bottom = part.sizeX / 2;

  // Horizontal offset of the bottom end relative to the top end in local coords.
  // Positive local X becomes screen-left (barrel side) after the SVG document's
  // scale(-1 1) mirror, so a positive tipOffset curves the bottom toward the barrel.
  // "angled" allows forward (positive) or slight backward (negative) tilt.
  // "curved" uses a large positive offset for a pronounced banana-magazine shape.
  const tipOffset =
    profile === "angled"
      ? rangeFloat(prng, -part.sizeY * 0.4, part.sizeY * 2.0)
      : profile === "curved"
        ? part.sizeY * 3.0
        : 0;

  // Bezier control point horizontal offset for the curved profile.
  // A larger value creates a more pronounced bow in the middle of the magazine.
  const curveCtrl = profile === "curved" ? part.sizeY * 2.0 : 0;

  // Returns the horizontal x-shift at normalized vertical position t (0=top, 1=bottom).
  // Both edges shift by the same amount, keeping the sizeY span constant.
  const shiftAt = (t: number): number =>
    profile === "curved"
      ? 2 * t * (1 - t) * curveCtrl + t * t * tipOffset
      : tipOffset * t;

  // Main body: constant-sizeY rectangle (straight/angled) or banana curve (curved).
  const body =
    profile === "curved"
      ? `<path class="shell" d="M ${left} ${top}
          L ${right} ${top}
          Q ${right + curveCtrl} 0 ${right + tipOffset} ${bottom}
          L ${left + tipOffset} ${bottom}
          Q ${left + curveCtrl} 0 ${left} ${top}
          Z" />`
      : `<path class="shell" d="M ${left} ${top}
          L ${right} ${top}
          L ${right + tipOffset} ${bottom}
          L ${left + tipOffset} ${bottom}
          Z" />`;

  // Shade on the right-center area, following the magazine shape.
  const shadeMidX = part.sizeY * 0.02 + shiftAt(0.08);
  const shadeBottomOuterX = part.sizeY * 0.48 + shiftAt(0.94);
  const shadeBottomInnerX = part.sizeY * 0.08 + shiftAt(0.94);
  const shade = `<path class="shade" d="M ${shadeMidX} ${top + part.sizeX * 0.08} L ${shadeBottomOuterX} ${bottom - part.sizeX * 0.06} L ${shadeBottomInnerX} ${bottom - part.sizeX * 0.02} Z" />`;

  // Ammunition witness panel near the top of the magazine.
  const panel = `<rect class="panel" x="${-part.sizeY * 0.18 + shiftAt(0.04)}" y="${top + part.sizeX * 0.04}" width="${part.sizeY * 0.36}" height="${part.sizeX * 0.08}" rx="1" />`;

  // Horizontal rib reinforcement lines, offset to follow the profile shape.
  let ribLines = "";
  for (let index = 0; index < ribs; index += 1) {
    const t = 0.18 + index * (0.56 / Math.max(1, ribs - 1));
    const y = top + part.sizeX * t;
    const xOff = shiftAt(t);
    ribLines += `<path class="detail" d="M ${left + xOff + part.sizeY * 0.08} ${y} L ${right + xOff - part.sizeY * 0.08} ${y}" />`;
  }

  // Highlight along the left edge area.
  const highlight = `<path class="highlight" d="M ${left + part.sizeY * 0.1 + shiftAt(0.1)} ${top + part.sizeX * 0.1} L ${right - part.sizeY * 0.16 + shiftAt(0.82)} ${top + part.sizeX * 0.82}" />`;

  return renderPartGroup(
    part,
    "part magazine",
    `
      ${body}
      ${shade}
      ${panel}
      ${ribLines}
      ${highlight}
    `,
  );
}
