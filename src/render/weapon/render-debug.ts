import { LayoutPart } from "../../core/types";

export function renderDebug(parts: LayoutPart[]): string {
  return parts
    .map(
      (part) => `
        <g class="debug">
          <rect x="${part.x - part.length / 2}" y="${part.y - part.width / 2}" width="${part.length}" height="${part.width}" fill="none" stroke="rgba(162, 75, 42, 0.35)" stroke-dasharray="6 4" />
          <circle cx="${part.x}" cy="${part.y}" r="3" fill="rgba(51, 92, 103, 0.6)" />
        </g>
      `,
    )
    .join("");
}
