import { LayoutBounds } from "../../core/types";

export function createSvgDocument(
  bounds: LayoutBounds,
  content: string,
): string {
  const width = bounds.maxX - bounds.minX;
  const height = bounds.maxY - bounds.minY;
  return `
    <svg viewBox="${bounds.minX} ${bounds.minY} ${width} ${height}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Generated firearm illustration">
      <defs>
        <filter id="paper-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="8" stdDeviation="10" flood-opacity="0.3" />
        </filter>
      </defs>
      <g transform="scale(-1 1) translate(${-bounds.minX - bounds.maxX} 0)" filter="url(#paper-shadow)">
        ${content}
      </g>
    </svg>
  `;
}
