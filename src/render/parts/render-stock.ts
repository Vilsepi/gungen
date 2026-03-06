import { LayoutPart } from "../../core/types";

export function renderStock(part: LayoutPart): string {
  return `
    <g class="part stock" transform="translate(${part.x} ${part.y}) rotate(${part.rotationDeg})">
      <path d="M ${part.length / 2} ${-part.width * 0.18} L ${-part.length * 0.16} ${-part.width / 2} Q ${-part.length / 2} 0 ${-part.length * 0.16} ${part.width / 2} L ${part.length / 2} ${part.width * 0.18} Z" />
      <line x1="${-part.length * 0.28}" y1="0" x2="${part.length * 0.34}" y2="0" opacity="0.35" />
    </g>
  `;
}
