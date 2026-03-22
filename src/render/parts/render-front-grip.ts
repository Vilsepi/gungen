import { LayoutPart } from "../../core/types";

export function renderFrontGrip(part: LayoutPart): string {
  return `
    <g class="part front-grip" transform="translate(${part.x} ${part.y}) rotate(${part.rotationDeg})">
      <path d="M ${-part.sizeX / 2} ${-part.sizeY / 2} L ${part.sizeX / 2} ${-part.sizeY / 2} L ${part.sizeX * 0.22} ${part.sizeY / 2} L ${-part.sizeX * 0.28} ${part.sizeY / 2} Z" />
    </g>
  `;
}
