import { LayoutPart } from "../../core/types";
import { pickOne, rangeInt } from "../../random/pick";
import { Prng } from "../../random/prng";
import { renderPartGroup } from "./shared";

export function renderHandguard(part: LayoutPart, prng: Prng): string {
  const profile = pickOne(prng, ["railed", "tapered", "tube"] as const);
  const slots = rangeInt(prng, 4, 8);
  const left = -part.length / 2;
  const right = part.length / 2;
  const top = -part.width / 2;
  const bottom = part.width / 2;

  const bodyByProfile = {
    railed: `M ${left} ${top + part.width * 0.14}
      L ${left + part.length * 0.06} ${top + part.width * 0.08}
      L ${right - part.length * 0.08} ${top + part.width * 0.08}
      L ${right} ${top + part.width * 0.16}
      L ${right - part.length * 0.02} ${bottom - part.width * 0.14}
      L ${left + part.length * 0.04} ${bottom - part.width * 0.1}
      Z`,
    tapered: `M ${left} ${top + part.width * 0.18}
      L ${left + part.length * 0.08} ${top + part.width * 0.1}
      L ${right - part.length * 0.12} ${top + part.width * 0.12}
      L ${right} ${top + part.width * 0.24}
      L ${right - part.length * 0.02} ${bottom - part.width * 0.18}
      L ${left + part.length * 0.06} ${bottom - part.width * 0.08}
      Z`,
    tube: `M ${left + part.length * 0.01} ${top + part.width * 0.24}
      Q ${left + part.length * 0.08} ${top + part.width * 0.02} ${left + part.length * 0.24} ${top + part.width * 0.04}
      L ${right - part.length * 0.16} ${top + part.width * 0.08}
      Q ${right - part.length * 0.02} ${top + part.width * 0.12} ${right} ${top + part.width * 0.28}
      L ${right - part.length * 0.02} ${bottom - part.width * 0.22}
      Q ${right - part.length * 0.16} ${bottom - part.width * 0.04} ${left + part.length * 0.12} ${bottom - part.width * 0.06}
      Q ${left + part.length * 0.02} ${bottom - part.width * 0.08} ${left + part.length * 0.01} ${top + part.width * 0.24}
      Z`,
  };

  let sideSlots = "";
  for (let index = 0; index < slots; index += 1) {
    const x =
      -part.length * 0.34 +
      index * ((part.length * 0.72) / Math.max(1, slots - 1));
    sideSlots += `<rect class="void" x="${x}" y="${-part.width * 0.16}" width="${part.length * 0.07}" height="${part.width * 0.16}" rx="1.2" />`;
  }

  let railTeeth = "";
  const railCount = Math.max(5, Math.round(part.length / 28));
  for (let index = 0; index < railCount; index += 1) {
    const x =
      left + part.length * 0.08 + index * ((part.length * 0.8) / railCount);
    railTeeth += `<rect class="rail-notch" x="${x}" y="${top - part.width * 0.14}" width="${part.length * 0.035}" height="${part.width * 0.08}" rx="0.9" />`;
  }

  return renderPartGroup(
    part,
    "part handguard",
    `
      <path class="shell" d="${bodyByProfile[profile]}" />
      <path class="shade" d="M ${left + part.length * 0.04} ${part.width * 0.02} L ${right - part.length * 0.02} ${part.width * 0.02} L ${right - part.length * 0.12} ${bottom - part.width * 0.08} L ${left + part.length * 0.1} ${bottom - part.width * 0.04} Z" />
      <path class="highlight" d="M ${left + part.length * 0.08} ${top + part.width * 0.18} L ${right - part.length * 0.08} ${top + part.width * 0.18}" />
      <rect class="panel" x="${left + part.length * 0.08}" y="${top + part.width * 0.14}" width="${part.length * 0.76}" height="${part.width * 0.22}" rx="1.8" />
      ${sideSlots}
      ${railTeeth}
      <path class="detail" d="M ${left + part.length * 0.04} ${top + part.width * 0.06} L ${right - part.length * 0.04} ${top + part.width * 0.06}" />
      <path class="detail" d="M ${left + part.length * 0.08} ${bottom - part.width * 0.16} L ${right - part.length * 0.08} ${bottom - part.width * 0.18}" />
      <circle class="pin" cx="${left + part.length * 0.1}" cy="${part.width * 0.04}" r="${Math.max(1.2, part.width * 0.032)}" />
      <circle class="pin" cx="${right - part.length * 0.12}" cy="${part.width * 0.02}" r="${Math.max(1.2, part.width * 0.03)}" />
    `,
  );
}
