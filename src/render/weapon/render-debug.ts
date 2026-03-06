import { LayoutPart } from "../../core/types";

export function renderDebug(parts: LayoutPart[]): string {
  return parts
    .map(
      (part) => `
        <g class="debug">
          <rect x="${part.x - part.length / 2}" y="${part.y - part.width / 2}" width="${part.length}" height="${part.width}" fill="none" stroke="rgba(247, 225, 31, 0.73)" stroke-dasharray="6 4" />
          <circle cx="${part.x}" cy="${part.y}" r="4" fill="rgba(239, 148, 11, 0.8)" />
        </g>
      `,
    )
    .join("");
}
