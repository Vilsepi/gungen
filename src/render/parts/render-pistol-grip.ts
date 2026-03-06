import { LayoutPart } from "../../core/types";

export function renderPistolGrip(part: LayoutPart): string {
  return `
    <g class="part pistol-grip" transform="translate(${part.x} ${part.y}) rotate(${part.rotationDeg})">
      <path d="M ${-part.width / 2} ${-part.length / 2} Q ${part.width / 2} ${-part.length * 0.2} ${part.width * 0.34} ${part.length / 2} L ${-part.width * 0.3} ${part.length / 2} Q ${-part.width * 0.56} ${part.length * 0.05} ${-part.width / 2} ${-part.length / 2} Z" />
      <line x1="${-part.width * 0.12}" y1="${-part.length * 0.16}" x2="${part.width * 0.2}" y2="${part.length * 0.24}" opacity="0.42" />
    </g>
  `;
}
