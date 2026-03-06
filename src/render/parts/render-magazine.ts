import { LayoutPart } from "../../core/types";
import { renderRoundedBody } from "./shared";

export function renderMagazine(part: LayoutPart): string {
  const taper = `
    <path d="M ${-part.width / 2} ${-part.length / 2} L ${part.width / 2} ${-part.length / 2} L ${part.width * 0.38} ${part.length / 2} L ${-part.width * 0.38} ${part.length / 2} Z" />
  `;
  return `
    <g class="part magazine" transform="translate(${part.x} ${part.y}) rotate(${part.rotationDeg})">
      ${taper}
      <line x1="0" y1="${-part.length / 2}" x2="0" y2="${part.length / 2}" opacity="0.35" />
    </g>
  `;
}
