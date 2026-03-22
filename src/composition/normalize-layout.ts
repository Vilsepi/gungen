import { LayoutBounds, LayoutPart } from "../core/types";

function usesVerticalMajorAxis(part: LayoutPart): boolean {
  return (
    part.kind === "magwell" ||
    part.kind === "magazine" ||
    part.kind === "pistolGrip" ||
    part.kind === "frontGrip"
  );
}

function computeHalfExtents(part: LayoutPart): {
  halfX: number;
  halfY: number;
} {
  const major = usesVerticalMajorAxis(part) ? part.width : part.length;
  const minor = usesVerticalMajorAxis(part) ? part.length : part.width;
  const radians = (part.rotationDeg * Math.PI) / 180;
  const cos = Math.abs(Math.cos(radians));
  const sin = Math.abs(Math.sin(radians));

  return {
    halfX: (major / 2) * cos + (minor / 2) * sin,
    halfY: (major / 2) * sin + (minor / 2) * cos,
  };
}

export function computeBounds(parts: LayoutPart[]): LayoutBounds {
  let minX = Number.POSITIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;

  for (const part of parts) {
    const { halfX, halfY } = computeHalfExtents(part);
    minX = Math.min(minX, part.x - halfX);
    maxX = Math.max(maxX, part.x + halfX);
    minY = Math.min(minY, part.y - halfY);
    maxY = Math.max(maxY, part.y + halfY);
  }

  const padding = 28;
  return {
    minX: minX - padding,
    minY: minY - padding,
    maxX: maxX + padding,
    maxY: maxY + padding,
  };
}
