import { LayoutPart } from "../../core/types";
import { pickOne, rangeInt } from "../../random/pick";
import { Prng } from "../../random/prng";
import { line, renderPartGroup } from "./shared";

export function renderReceiver(part: LayoutPart, prng: Prng): string {
  const profile = pickOne(prng, ["slab", "carbine", "precision"] as const);
  const cuts = rangeInt(prng, 3, 5);
  const left = -part.sizeX / 2;
  const right = part.sizeX / 2;
  const top = -part.sizeY / 2;
  const bottom = part.sizeY / 2;
  const railStart = left + part.sizeX * 0.18;
  const railEnd = right - part.sizeX * 0.12;

  const outerByProfile = {
    slab: `M ${left} ${top + part.sizeY * 0.12}
      L ${left + part.sizeX * 0.1} ${top + part.sizeY * 0.08}
      L ${railStart} ${top + part.sizeY * 0.08}
      L ${railStart + part.sizeX * 0.07} ${top - part.sizeY * 0.12}
      L ${railEnd - part.sizeX * 0.06} ${top - part.sizeY * 0.12}
      L ${railEnd} ${top + part.sizeY * 0.06}
      L ${right} ${top + part.sizeY * 0.1}
      L ${right} ${bottom - part.sizeY * 0.14}
      L ${right - part.sizeX * 0.1} ${bottom}
      L ${left + part.sizeX * 0.22} ${bottom}
      L ${left + part.sizeX * 0.12} ${bottom - part.sizeY * 0.26}
      L ${left} ${bottom - part.sizeY * 0.18}
      Z`,
    carbine: `M ${left} ${top + part.sizeY * 0.18}
      L ${left + part.sizeX * 0.12} ${top + part.sizeY * 0.14}
      L ${railStart} ${top + part.sizeY * 0.12}
      L ${railStart + part.sizeX * 0.06} ${top - part.sizeY * 0.18}
      L ${railEnd - part.sizeX * 0.12} ${top - part.sizeY * 0.18}
      L ${railEnd} ${top + part.sizeY * 0.08}
      L ${right - part.sizeX * 0.02} ${top + part.sizeY * 0.12}
      L ${right} ${bottom - part.sizeY * 0.22}
      L ${right - part.sizeX * 0.08} ${bottom - part.sizeY * 0.04}
      L ${left + part.sizeX * 0.62} ${bottom - part.sizeY * 0.04}
      L ${left + part.sizeX * 0.54} ${bottom}
      L ${left + part.sizeX * 0.16} ${bottom}
      L ${left + part.sizeX * 0.04} ${bottom - part.sizeY * 0.22}
      Z`,
    precision: `M ${left} ${top + part.sizeY * 0.18}
      L ${left + part.sizeX * 0.16} ${top + part.sizeY * 0.14}
      L ${railStart - part.sizeX * 0.04} ${top + part.sizeY * 0.14}
      L ${railStart + part.sizeX * 0.04} ${top - part.sizeY * 0.16}
      L ${railEnd - part.sizeX * 0.04} ${top - part.sizeY * 0.16}
      L ${railEnd + part.sizeX * 0.02} ${top + part.sizeY * 0.08}
      L ${right} ${top + part.sizeY * 0.14}
      L ${right} ${bottom - part.sizeY * 0.2}
      L ${right - part.sizeX * 0.16} ${bottom}
      L ${left + part.sizeX * 0.34} ${bottom}
      L ${left + part.sizeX * 0.24} ${bottom - part.sizeY * 0.12}
      L ${left + part.sizeX * 0.12} ${bottom - part.sizeY * 0.12}
      Z`,
  };

  let railNotches = "";
  for (let index = 0; index < cuts + 3; index += 1) {
    const x = railStart + index * ((railEnd - railStart) / (cuts + 2));
    railNotches += `<rect class="rail-notch" x="${x - part.sizeX * 0.018}" y="${top - part.sizeY * 0.22}" width="${part.sizeX * 0.03}" height="${part.sizeY * 0.08}" rx="0.8" />`;
  }

  let panelCuts = "";
  for (let index = 0; index < cuts; index += 1) {
    const x = left + part.sizeX * 0.1 + index * (part.sizeX * 0.12);
    panelCuts += `<rect class="panel" x="${x}" y="${-part.sizeY * 0.12}" width="${part.sizeX * 0.065}" height="${part.sizeY * 0.24}" rx="1.2" />`;
  }

  const ejectionPortX = left + part.sizeX * 0.1;
  const ejectionPortY = top + part.sizeY * 0.08;

  return renderPartGroup(
    part,
    "part receiver",
    `
      <path class="shell" d="${outerByProfile[profile]}" />
      <path class="shade" d="M ${left + part.sizeX * 0.06} ${part.sizeY * 0.02} L ${right - part.sizeX * 0.1} ${part.sizeY * 0.02} L ${right - part.sizeX * 0.16} ${bottom - part.sizeY * 0.06} L ${left + part.sizeX * 0.14} ${bottom - part.sizeY * 0.1} Z" />
      <path class="highlight" d="M ${left + part.sizeX * 0.08} ${top + part.sizeY * 0.18} L ${right - part.sizeX * 0.14} ${top + part.sizeY * 0.18}" />
      <rect class="panel" x="${ejectionPortX}" y="${ejectionPortY}" width="${part.sizeX * 0.3}" height="${part.sizeY * 0.18}" rx="1.5" />
      <rect class="void" x="${left + part.sizeX * 0.34}" y="${top + part.sizeY * 0.2}" width="${part.sizeX * 0.12}" height="${part.sizeY * 0.12}" rx="1" />
      ${panelCuts}
      ${railNotches}
      ${line(left + part.sizeX * 0.08, part.sizeY * 0.04, right - part.sizeX * 0.08, part.sizeY * 0.04, 0.7).replace("<line ", '<line class="detail" ')}
      <path class="detail" d="M ${right - part.sizeX * 0.2} ${top + part.sizeY * 0.08} q ${part.sizeX * 0.08} ${part.sizeY * 0.16} 0 ${part.sizeY * 0.34}" />
      <path class="detail" d="M ${left + part.sizeX * 0.18} ${bottom - part.sizeY * 0.18} q ${part.sizeX * 0.08} ${part.sizeY * 0.08} ${part.sizeX * 0.2} 0" />
      <circle class="pin" cx="${left + part.sizeX * 0.04}" cy="${part.sizeY * 0.04}" r="${Math.max(1.5, part.sizeY * 0.045)}" />
      <circle class="pin" cx="${left + part.sizeX * 0.3}" cy="${part.sizeY * 0.12}" r="${Math.max(1.4, part.sizeY * 0.04)}" />
      <circle class="pin" cx="${right - part.sizeX * 0.14}" cy="${part.sizeY * 0.14}" r="${Math.max(1.3, part.sizeY * 0.036)}" />
    `,
  );
}
