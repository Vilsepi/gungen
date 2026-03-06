import { LayoutBounds, LayoutPart } from "../core/types";

export function computeBounds(parts: LayoutPart[]): LayoutBounds {
  let minX = Number.POSITIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;

  for (const part of parts) {
    minX = Math.min(minX, part.x - part.length / 2);
    maxX = Math.max(maxX, part.x + part.length / 2);
    minY = Math.min(minY, part.y - part.width / 2);
    maxY = Math.max(maxY, part.y + part.width / 2);
  }

  const padding = 28;
  return {
    minX: minX - padding,
    minY: minY - padding,
    maxX: maxX + padding,
    maxY: maxY + padding,
  };
}
