import { LayoutPart } from "../../core/types";

export function renderDebug(parts: LayoutPart[]): string {
  return parts
    .map(
      (part) => `
        <g class="debug">
          <rect x="${part.x - part.length / 2}" y="${part.y - part.width / 2}" width="${part.length}" height="${part.width}" fill="none" stroke="rgba(169, 215, 251, 0.45)" stroke-dasharray="6 4" />
          <circle cx="${part.x}" cy="${part.y}" r="3" fill="rgba(169, 215, 251, 0.8)" />
        </g>
      `,
    )
    .join("");
}
