import { LayoutPart } from "../../core/types";
import { rangeInt } from "../../random/pick";
import { Prng } from "../../random/prng";
import { renderPartGroup } from "./shared";

export function renderMagazine(part: LayoutPart, prng: Prng): string {
  const left = -part.width / 2;
  const right = part.width / 2;
  const top = -part.length / 2;
  const bottom = part.length / 2;
  const ribs = rangeInt(prng, 3, 6);
  const isCurved = part.length / Math.max(part.width, 1) > 2.6;

  const body = isCurved
    ? `<path class="shell" d="M ${left} ${top}
        L ${right} ${top}
        Q ${part.width * 0.88} ${-part.length * 0.16} ${part.width * 0.42} ${bottom}
        L ${-part.width * 0.12} ${bottom}
        Q ${-part.width * 0.72} ${part.length * 0.1} ${left} ${top}
        Z" />`
    : `<path class="shell" d="M ${left} ${top}
        L ${right} ${top}
        L ${part.width * 0.38} ${bottom}
        L ${-part.width * 0.34} ${bottom}
        Z" />`;

  let ribLines = "";
  for (let index = 0; index < ribs; index += 1) {
    const y =
      top +
      part.length * 0.18 +
      index * ((part.length * 0.56) / Math.max(1, ribs - 1));
    ribLines += `<path class="detail" d="M ${left + part.width * 0.08} ${y} Q 0 ${y + part.length * 0.03} ${right - part.width * 0.08} ${y + (isCurved ? part.length * 0.05 : 0)}" />`;
  }

  return renderPartGroup(
    part,
    "part magazine",
    `
      ${body}
      <path class="shade" d="M ${-part.width * 0.02} ${top + part.length * 0.08} Q ${part.width * 0.26} ${part.length * 0.08} ${part.width * 0.24} ${bottom - part.length * 0.04} L ${part.width * 0.04} ${bottom - part.length * 0.02} Z" />
      <rect class="panel" x="${-part.width * 0.18}" y="${top + part.length * 0.04}" width="${part.width * 0.36}" height="${part.length * 0.08}" rx="1" />
      ${ribLines}
      <path class="highlight" d="M ${left + part.width * 0.1} ${top + part.length * 0.1} Q 0 ${top + part.length * 0.14} ${right - part.width * 0.16} ${bottom - part.length * 0.18}" />
    `,
  );
}
