import { LayoutPart } from "../../core/types";
import { pickOne, rangeInt } from "../../random/pick";
import { Prng } from "../../random/prng";
import { renderPartGroup } from "./shared";

export function renderHandguard(part: LayoutPart, prng: Prng): string {
  const profile = pickOne(prng, ["railed", "tapered", "tube"] as const);
  const slots = rangeInt(prng, 4, 8);
  const left = -part.sizeX / 2;
  const right = part.sizeX / 2;
  const top = -part.sizeY / 2;
  const bottom = part.sizeY / 2;

  const bodyByProfile = {
    railed: `M ${left} ${top + part.sizeY * 0.14}
      L ${left + part.sizeX * 0.06} ${top + part.sizeY * 0.08}
      L ${right - part.sizeX * 0.08} ${top + part.sizeY * 0.08}
      L ${right} ${top + part.sizeY * 0.16}
      L ${right - part.sizeX * 0.02} ${bottom - part.sizeY * 0.14}
      L ${left + part.sizeX * 0.04} ${bottom - part.sizeY * 0.1}
      Z`,
    tapered: `M ${left} ${top + part.sizeY * 0.18}
      L ${left + part.sizeX * 0.08} ${top + part.sizeY * 0.1}
      L ${right - part.sizeX * 0.12} ${top + part.sizeY * 0.12}
      L ${right} ${top + part.sizeY * 0.24}
      L ${right - part.sizeX * 0.02} ${bottom - part.sizeY * 0.18}
      L ${left + part.sizeX * 0.06} ${bottom - part.sizeY * 0.08}
      Z`,
    tube: `M ${left + part.sizeX * 0.01} ${top + part.sizeY * 0.24}
      Q ${left + part.sizeX * 0.08} ${top + part.sizeY * 0.02} ${left + part.sizeX * 0.24} ${top + part.sizeY * 0.04}
      L ${right - part.sizeX * 0.16} ${top + part.sizeY * 0.08}
      Q ${right - part.sizeX * 0.02} ${top + part.sizeY * 0.12} ${right} ${top + part.sizeY * 0.28}
      L ${right - part.sizeX * 0.02} ${bottom - part.sizeY * 0.22}
      Q ${right - part.sizeX * 0.16} ${bottom - part.sizeY * 0.04} ${left + part.sizeX * 0.12} ${bottom - part.sizeY * 0.06}
      Q ${left + part.sizeX * 0.02} ${bottom - part.sizeY * 0.08} ${left + part.sizeX * 0.01} ${top + part.sizeY * 0.24}
      Z`,
  };

  let sideSlots = "";
  for (let index = 0; index < slots; index += 1) {
    const x =
      -part.sizeX * 0.34 +
      index * ((part.sizeX * 0.72) / Math.max(1, slots - 1));
    sideSlots += `<rect class="void" x="${x}" y="${-part.sizeY * 0.16}" width="${part.sizeX * 0.07}" height="${part.sizeY * 0.16}" rx="1.2" />`;
  }

  let railTeeth = "";
  const railCount = Math.max(5, Math.round(part.sizeX / 28));
  for (let index = 0; index < railCount; index += 1) {
    const x =
      left + part.sizeX * 0.08 + index * ((part.sizeX * 0.8) / railCount);
    railTeeth += `<rect class="rail-notch" x="${x}" y="${top - part.sizeY * 0.14}" width="${part.sizeX * 0.035}" height="${part.sizeY * 0.08}" rx="0.9" />`;
  }

  return renderPartGroup(
    part,
    "part handguard",
    `
      <path class="shell" d="${bodyByProfile[profile]}" />
      <path class="shade" d="M ${left + part.sizeX * 0.04} ${part.sizeY * 0.02} L ${right - part.sizeX * 0.02} ${part.sizeY * 0.02} L ${right - part.sizeX * 0.12} ${bottom - part.sizeY * 0.08} L ${left + part.sizeX * 0.1} ${bottom - part.sizeY * 0.04} Z" />
      <path class="highlight" d="M ${left + part.sizeX * 0.08} ${top + part.sizeY * 0.18} L ${right - part.sizeX * 0.08} ${top + part.sizeY * 0.18}" />
      <rect class="panel" x="${left + part.sizeX * 0.08}" y="${top + part.sizeY * 0.14}" width="${part.sizeX * 0.76}" height="${part.sizeY * 0.22}" rx="1.8" />
      ${sideSlots}
      ${railTeeth}
      <path class="detail" d="M ${left + part.sizeX * 0.04} ${top + part.sizeY * 0.06} L ${right - part.sizeX * 0.04} ${top + part.sizeY * 0.06}" />
      <path class="detail" d="M ${left + part.sizeX * 0.08} ${bottom - part.sizeY * 0.16} L ${right - part.sizeX * 0.08} ${bottom - part.sizeY * 0.18}" />
      <circle class="pin" cx="${left + part.sizeX * 0.1}" cy="${part.sizeY * 0.04}" r="${Math.max(1.2, part.sizeY * 0.032)}" />
      <circle class="pin" cx="${right - part.sizeX * 0.12}" cy="${part.sizeY * 0.02}" r="${Math.max(1.2, part.sizeY * 0.03)}" />
    `,
  );
}
