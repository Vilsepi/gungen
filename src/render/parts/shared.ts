import { LayoutPart } from "../../core/types";
import { transformTranslateRotate } from "../svg/transforms";

export function renderRoundedBody(
  part: LayoutPart,
  bodyClass: string,
  inner: string,
  radiusFactor = 0.08,
): string {
  const rx = Math.max(1.5, part.width * radiusFactor);
  return `
    <g class="${bodyClass}" transform="${transformTranslateRotate(part.x, part.y, part.rotationDeg)}">
      <rect x="${-part.length / 2}" y="${-part.width / 2}" width="${part.length}" height="${part.width}" rx="${rx}" />
      ${inner}
    </g>
  `;
}

export function line(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  opacity = 0.7,
): string {
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" opacity="${opacity}" />`;
}
