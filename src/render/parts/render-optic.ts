import { LayoutPart } from "../../core/types";

export function renderOptic(part: LayoutPart): string {
  const mountHeight = part.width * 0.48;
  const mountTopY = part.width / 2 - mountHeight;
  const opticBodyCenterY = mountTopY - part.width / 2;

  return `
    <g class="part optic" transform="translate(${part.x} ${part.y}) rotate(${part.rotationDeg})">
      <rect x="${-part.length / 2}" y="${opticBodyCenterY - part.width / 2}" width="${part.length}" height="${part.width}" rx="${Math.max(1.5, part.width * 0.1)}" />
      <rect x="${-part.length * 0.18}" y="${mountTopY}" width="${part.length * 0.36}" height="${mountHeight}" rx="1" opacity="0.75" />
      <line x1="${-part.length * 0.24}" y1="${opticBodyCenterY}" x2="${part.length * 0.24}" y2="${opticBodyCenterY}" opacity="0.35" />
    </g>
  `;
}
