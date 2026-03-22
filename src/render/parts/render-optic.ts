import { LayoutPart } from "../../core/types";

export function renderOptic(part: LayoutPart): string {
  return `
    <g class="part optic" transform="translate(${part.x} ${part.y}) rotate(${part.rotationDeg})">
      <rect x="${-part.length / 2}" y="${-part.width / 2}" width="${part.length}" height="${part.width}" rx="${Math.max(1.5, part.width * 0.1)}" />
      <rect x="${-part.length * 0.18}" y="${part.width * 0.3}" width="${part.length * 0.36}" height="${part.width * 0.24}" rx="1" opacity="0.75" />
      <line x1="${-part.length * 0.24}" y1="0" x2="${part.length * 0.24}" y2="0" opacity="0.35" />
    </g>
  `;
}
