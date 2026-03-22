import { LayoutPart } from "../../core/types";

export function renderPistolGrip(part: LayoutPart): string {
  return `
    <g class="part pistol-grip" transform="translate(${part.x} ${part.y}) rotate(${part.rotationDeg})">
      <path d="M ${-part.sizeX / 2} ${-part.sizeY / 2} Q ${part.sizeX / 2} ${-part.sizeY * 0.2} ${part.sizeX * 0.34} ${part.sizeY / 2} L ${-part.sizeX * 0.3} ${part.sizeY / 2} Q ${-part.sizeX * 0.56} ${part.sizeY * 0.05} ${-part.sizeX / 2} ${-part.sizeY / 2} Z" />
      <line x1="${-part.sizeX * 0.12}" y1="${-part.sizeY * 0.16}" x2="${part.sizeX * 0.2}" y2="${part.sizeY * 0.24}" opacity="0.42" />
    </g>
  `;
}
