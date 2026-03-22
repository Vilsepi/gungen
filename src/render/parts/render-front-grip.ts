import { LayoutPart } from "../../core/types";

export function renderFrontGrip(part: LayoutPart): string {
  return `
    <g class="part front-grip" transform="translate(${part.x} ${part.y}) rotate(${part.rotationDeg})">
      <path d="M ${-part.sizeY / 2} ${-part.sizeX / 2} L ${part.sizeY / 2} ${-part.sizeX / 2} L ${part.sizeY * 0.22} ${part.sizeX / 2} L ${-part.sizeY * 0.28} ${part.sizeX / 2} Z" />
    </g>
  `;
}
