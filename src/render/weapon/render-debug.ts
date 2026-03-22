import { LayoutPart } from "../../core/types";

function formatPartName(kind: LayoutPart["kind"]): string {
  return kind.replace(/([A-Z])/g, " $1").replace(/^./, (match) => match.toUpperCase());
}

export function renderDebug(parts: LayoutPart[]): string {
  return parts
    .map(
      (part) => `
        <g class="debug">
          <rect x="${part.x - part.length / 2}" y="${part.y - part.width / 2}" width="${part.length}" height="${part.width}" fill="none" stroke="rgba(247, 225, 31, 0.73)" stroke-dasharray="6 4" />
          <circle cx="${part.x}" cy="${part.y}" r="4" fill="rgba(239, 148, 11, 0.8)" />
          <text x="${part.x}" y="${part.y - part.width / 2 - 10}" transform="translate(${part.x * 2} 0) scale(-1 1)" text-anchor="middle" font-size="14" font-family="monospace" fill="rgba(247, 225, 31, 0.95)" stroke="rgba(19, 24, 30, 0.9)" stroke-width="3" paint-order="stroke">${formatPartName(part.kind)}</text>
        </g>
      `,
    )
    .join("");
}
