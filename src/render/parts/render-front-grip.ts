import { LayoutPart } from "../../core/types";

export function renderFrontGrip(part: LayoutPart): string {
  return `
    <g class="part front-grip" transform="translate(${part.x} ${part.y}) rotate(${part.rotationDeg})">
      <path d="M ${-part.width / 2} ${-part.length / 2} L ${part.width / 2} ${-part.length / 2} L ${part.width * 0.22} ${part.length / 2} L ${-part.width * 0.28} ${part.length / 2} Z" />
    </g>
  `;
}
