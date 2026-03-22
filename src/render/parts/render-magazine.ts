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
  const left = -part.width / 2;
  const right = part.width / 2;
  const top = -part.length / 2;
  const bottom = part.length / 2;

  // Horizontal offset of the bottom end relative to the top end.
  // "angled" allows forward (positive) or slight backward (negative) tilt.
  // "curved" uses a large forward offset for a pronounced banana-magazine shape.
  const tipOffset =
    profile === "angled"
      ? rangeFloat(prng, -part.width * 0.4, part.width * 2.0)
      : profile === "curved"
        ? part.width * 3.0
        : 0;

  // Bezier control point horizontal offset for the curved profile.
  // A larger value creates a more pronounced bow in the middle of the magazine.
  const curveCtrl = profile === "curved" ? part.width * 2.0 : 0;

  // Returns the horizontal x-shift at normalized height t (0=top, 1=bottom).
  // Both edges shift by the same amount, keeping magazine width constant.
  const shiftAt = (t: number): number =>
    profile === "curved"
      ? 2 * t * (1 - t) * curveCtrl + t * t * tipOffset
      : tipOffset * t;

  // Main body: constant-width rectangle (straight/angled) or banana curve (curved).
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
  const shadeMidX = part.width * 0.02 + shiftAt(0.08);
  const shadeBottomOuterX = part.width * 0.48 + shiftAt(0.94);
  const shadeBottomInnerX = part.width * 0.08 + shiftAt(0.94);
  const shade = `<path class="shade" d="M ${shadeMidX} ${top + part.length * 0.08} L ${shadeBottomOuterX} ${bottom - part.length * 0.06} L ${shadeBottomInnerX} ${bottom - part.length * 0.02} Z" />`;

  // Ammunition witness panel near the top of the magazine.
  const panel = `<rect class="panel" x="${-part.width * 0.18 + shiftAt(0.04)}" y="${top + part.length * 0.04}" width="${part.width * 0.36}" height="${part.length * 0.08}" rx="1" />`;

  // Horizontal rib reinforcement lines, offset to follow the profile shape.
  let ribLines = "";
  for (let index = 0; index < ribs; index += 1) {
    const t = 0.18 + index * (0.56 / Math.max(1, ribs - 1));
    const y = top + part.length * t;
    const xOff = shiftAt(t);
    ribLines += `<path class="detail" d="M ${left + xOff + part.width * 0.08} ${y} L ${right + xOff - part.width * 0.08} ${y}" />`;
  }

  // Highlight along the left edge area.
  const highlight = `<path class="highlight" d="M ${left + part.width * 0.1 + shiftAt(0.1)} ${top + part.length * 0.1} L ${right - part.width * 0.16 + shiftAt(0.82)} ${top + part.length * 0.82}" />`;

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
