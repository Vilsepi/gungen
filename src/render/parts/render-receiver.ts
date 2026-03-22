import { LayoutPart } from "../../core/types";
import { pickOne, rangeInt } from "../../random/pick";
import { Prng } from "../../random/prng";
import { line, renderPartGroup } from "./shared";

export function renderReceiver(part: LayoutPart, prng: Prng): string {
  const profile = pickOne(prng, ["slab", "carbine", "precision"] as const);
  const cuts = rangeInt(prng, 3, 5);
  const left = -part.length / 2;
  const right = part.length / 2;
  const top = -part.width / 2;
  const bottom = part.width / 2;
  const railStart = left + part.length * 0.18;
  const railEnd = right - part.length * 0.12;

  const outerByProfile = {
    slab: `M ${left} ${top + part.width * 0.12}
      L ${left + part.length * 0.1} ${top + part.width * 0.08}
      L ${railStart} ${top + part.width * 0.08}
      L ${railStart + part.length * 0.07} ${top - part.width * 0.12}
      L ${railEnd - part.length * 0.06} ${top - part.width * 0.12}
      L ${railEnd} ${top + part.width * 0.06}
      L ${right} ${top + part.width * 0.1}
      L ${right} ${bottom - part.width * 0.14}
      L ${right - part.length * 0.1} ${bottom}
      L ${left + part.length * 0.22} ${bottom}
      L ${left + part.length * 0.12} ${bottom - part.width * 0.26}
      L ${left} ${bottom - part.width * 0.18}
      Z`,
    carbine: `M ${left} ${top + part.width * 0.18}
      L ${left + part.length * 0.12} ${top + part.width * 0.14}
      L ${railStart} ${top + part.width * 0.12}
      L ${railStart + part.length * 0.06} ${top - part.width * 0.18}
      L ${railEnd - part.length * 0.12} ${top - part.width * 0.18}
      L ${railEnd} ${top + part.width * 0.08}
      L ${right - part.length * 0.02} ${top + part.width * 0.12}
      L ${right} ${bottom - part.width * 0.22}
      L ${right - part.length * 0.08} ${bottom - part.width * 0.04}
      L ${left + part.length * 0.62} ${bottom - part.width * 0.04}
      L ${left + part.length * 0.54} ${bottom}
      L ${left + part.length * 0.16} ${bottom}
      L ${left + part.length * 0.04} ${bottom - part.width * 0.22}
      Z`,
    precision: `M ${left} ${top + part.width * 0.18}
      L ${left + part.length * 0.16} ${top + part.width * 0.14}
      L ${railStart - part.length * 0.04} ${top + part.width * 0.14}
      L ${railStart + part.length * 0.04} ${top - part.width * 0.16}
      L ${railEnd - part.length * 0.04} ${top - part.width * 0.16}
      L ${railEnd + part.length * 0.02} ${top + part.width * 0.08}
      L ${right} ${top + part.width * 0.14}
      L ${right} ${bottom - part.width * 0.2}
      L ${right - part.length * 0.16} ${bottom}
      L ${left + part.length * 0.34} ${bottom}
      L ${left + part.length * 0.24} ${bottom - part.width * 0.12}
      L ${left + part.length * 0.12} ${bottom - part.width * 0.12}
      Z`,
  };

  let railNotches = "";
  for (let index = 0; index < cuts + 3; index += 1) {
    const x = railStart + index * ((railEnd - railStart) / (cuts + 2));
    railNotches += `<rect class="rail-notch" x="${x - part.length * 0.018}" y="${top - part.width * 0.22}" width="${part.length * 0.03}" height="${part.width * 0.08}" rx="0.8" />`;
  }

  let panelCuts = "";
  for (let index = 0; index < cuts; index += 1) {
    const x = left + part.length * 0.1 + index * (part.length * 0.12);
    panelCuts += `<rect class="panel" x="${x}" y="${-part.width * 0.12}" width="${part.length * 0.065}" height="${part.width * 0.24}" rx="1.2" />`;
  }

  const ejectionPortX = left + part.length * 0.1;
  const ejectionPortY = top + part.width * 0.08;

  return renderPartGroup(
    part,
    "part receiver",
    `
      <path class="shell" d="${outerByProfile[profile]}" />
      <path class="shade" d="M ${left + part.length * 0.06} ${part.width * 0.02} L ${right - part.length * 0.1} ${part.width * 0.02} L ${right - part.length * 0.16} ${bottom - part.width * 0.06} L ${left + part.length * 0.14} ${bottom - part.width * 0.1} Z" />
      <path class="highlight" d="M ${left + part.length * 0.08} ${top + part.width * 0.18} L ${right - part.length * 0.14} ${top + part.width * 0.18}" />
      <rect class="panel" x="${ejectionPortX}" y="${ejectionPortY}" width="${part.length * 0.3}" height="${part.width * 0.18}" rx="1.5" />
      <rect class="void" x="${left + part.length * 0.34}" y="${top + part.width * 0.2}" width="${part.length * 0.12}" height="${part.width * 0.12}" rx="1" />
      ${panelCuts}
      ${railNotches}
      ${line(left + part.length * 0.08, part.width * 0.04, right - part.length * 0.08, part.width * 0.04, 0.7).replace("<line ", '<line class="detail" ')}
      <path class="detail" d="M ${right - part.length * 0.2} ${top + part.width * 0.08} q ${part.length * 0.08} ${part.width * 0.16} 0 ${part.width * 0.34}" />
      <path class="detail" d="M ${left + part.length * 0.18} ${bottom - part.width * 0.18} q ${part.length * 0.08} ${part.width * 0.08} ${part.length * 0.2} 0" />
      <circle class="pin" cx="${left + part.length * 0.04}" cy="${part.width * 0.04}" r="${Math.max(1.5, part.width * 0.045)}" />
      <circle class="pin" cx="${left + part.length * 0.3}" cy="${part.width * 0.12}" r="${Math.max(1.4, part.width * 0.04)}" />
      <circle class="pin" cx="${right - part.length * 0.14}" cy="${part.width * 0.14}" r="${Math.max(1.3, part.width * 0.036)}" />
    `,
  );
}
