import { LayoutPart } from "../../core/types";
import { pickOne } from "../../random/pick";
import { Prng } from "../../random/prng";
import { renderPartGroup } from "./shared";

export function renderStock(part: LayoutPart, prng: Prng): string {
  const profile = pickOne(prng, [
    "collapsible",
    "skeleton",
    "precision",
  ] as const);
  const left = -part.length / 2;
  const right = part.length / 2;
  const top = -part.width / 2;
  const bottom = part.width / 2;

  const bodyByProfile = {
    collapsible: `M ${right} ${-part.width * 0.16}
      L ${left + part.length * 0.26} ${top + part.width * 0.08}
      L ${left + part.length * 0.08} ${top + part.width * 0.18}
      L ${left} ${top + part.width * 0.26}
      L ${left + part.length * 0.08} ${bottom - part.width * 0.22}
      L ${left + part.length * 0.26} ${bottom - part.width * 0.08}
      L ${right} ${part.width * 0.16}
      Z`,
    skeleton: `M ${right} ${-part.width * 0.16}
      L ${left + part.length * 0.3} ${top + part.width * 0.02}
      L ${left + part.length * 0.04} ${top + part.width * 0.2}
      L ${left + part.length * 0.08} ${bottom - part.width * 0.2}
      L ${left + part.length * 0.3} ${bottom - part.width * 0.02}
      L ${right} ${part.width * 0.16}
      Z`,
    precision: `M ${right} ${-part.width * 0.14}
      L ${left + part.length * 0.34} ${top + part.width * 0.04}
      L ${left + part.length * 0.12} ${top + part.width * 0.16}
      L ${left} ${top + part.width * 0.32}
      L ${left + part.length * 0.12} ${bottom - part.width * 0.18}
      L ${left + part.length * 0.22} ${bottom}
      L ${left + part.length * 0.48} ${bottom - part.width * 0.1}
      L ${right} ${part.width * 0.14}
      Z`,
  };

  const voidByProfile = {
    collapsible: `<path class="void" d="M ${left + part.length * 0.22} ${-part.width * 0.12} L ${right - part.length * 0.16} ${-part.width * 0.08} L ${right - part.length * 0.16} ${part.width * 0.08} L ${left + part.length * 0.22} ${part.width * 0.12} Z" />`,
    skeleton: `<path class="void" d="M ${left + part.length * 0.24} ${-part.width * 0.12} L ${right - part.length * 0.18} ${-part.width * 0.04} L ${right - part.length * 0.22} ${part.width * 0.12} L ${left + part.length * 0.28} ${part.width * 0.1} Z" />`,
    precision: `<path class="void" d="M ${left + part.length * 0.26} ${-part.width * 0.08} L ${right - part.length * 0.22} ${-part.width * 0.04} L ${right - part.length * 0.28} ${part.width * 0.08} L ${left + part.length * 0.34} ${part.width * 0.1} Z" />`,
  };

  return renderPartGroup(
    part,
    "part stock",
    `
      <path class="shell" d="${bodyByProfile[profile]}" />
      ${voidByProfile[profile]}
      <path class="shade" d="M ${left + part.length * 0.1} ${part.width * 0.02} L ${right - part.length * 0.1} ${part.width * 0.02} L ${right - part.length * 0.16} ${part.width * 0.18} L ${left + part.length * 0.2} ${part.width * 0.14} Z" />
      <path class="highlight" d="M ${left + part.length * 0.1} ${top + part.width * 0.2} L ${right - part.length * 0.12} ${top + part.width * 0.08}" />
      <path class="detail" d="M ${left + part.length * 0.08} 0 L ${right - part.length * 0.1} 0" />
      <rect class="panel" x="${left + part.length * 0.04}" y="${-part.width * 0.12}" width="${part.length * 0.12}" height="${part.width * 0.24}" rx="1.2" />
    `,
  );
}
