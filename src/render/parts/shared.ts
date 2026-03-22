import { LayoutPart } from "../../core/types";
import { transformTranslateRotate } from "../svg/transforms";

function getPartLevelClassName(part: LayoutPart): string {
  return `level-${part.partLevel.toLowerCase()}`;
}

export function renderPartGroup(
  part: LayoutPart,
  bodyClass: string,
  content: string,
): string {
  return `
    <g class="${bodyClass} ${getPartLevelClassName(part)}" data-part-level="${part.partLevel}" transform="${transformTranslateRotate(part.x, part.y, part.rotationDeg)}">
      ${content}
    </g>
  `;
}

export function renderRoundedBody(
  part: LayoutPart,
  bodyClass: string,
  inner: string,
  radiusFactor = 0.08,
): string {
  const rx = Math.max(1.5, part.sizeY * radiusFactor);
  return renderPartGroup(
    part,
    bodyClass,
    `
      <rect class="shell" x="${-part.sizeX / 2}" y="${-part.sizeY / 2}" width="${part.sizeX}" height="${part.sizeY}" rx="${rx}" />
      ${inner}
    `,
  );
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
