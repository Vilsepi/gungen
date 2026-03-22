import { LayoutPart } from "../../core/types";

export function renderPistolGrip(part: LayoutPart): string {
  return `
    <g class="part pistol-grip" transform="translate(${part.x} ${part.y}) rotate(${part.rotationDeg})">
      <path d="M ${-part.sizeY / 2} ${-part.sizeX / 2} Q ${part.sizeY / 2} ${-part.sizeX * 0.2} ${part.sizeY * 0.34} ${part.sizeX / 2} L ${-part.sizeY * 0.3} ${part.sizeX / 2} Q ${-part.sizeY * 0.56} ${part.sizeX * 0.05} ${-part.sizeY / 2} ${-part.sizeX / 2} Z" />
      <line x1="${-part.sizeY * 0.12}" y1="${-part.sizeX * 0.16}" x2="${part.sizeY * 0.2}" y2="${part.sizeX * 0.24}" opacity="0.42" />
    </g>
  `;
}
