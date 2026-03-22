import { LayoutPart } from "../../core/types";
import { renderPartGroup } from "./shared";

export function renderMagwell(part: LayoutPart): string {
  const left = -part.sizeY / 2;
  const right = part.sizeY / 2;
  const top = -part.sizeX / 2;
  const bottom = part.sizeX / 2;

  return renderPartGroup(
    part,
    "part magwell",
    `
      <path class="shell" d="M ${left} ${top + part.sizeX * 0.04}
        L ${right} ${top}
        L ${part.sizeY * 0.34} ${bottom - part.sizeX * 0.2}
        L ${part.sizeY * 0.18} ${bottom}
        L ${-part.sizeY * 0.18} ${bottom}
        L ${-part.sizeY * 0.34} ${bottom - part.sizeX * 0.16}
        Z" />
      <path class="shade" d="M ${-part.sizeY * 0.04} ${top + part.sizeX * 0.08}
        L ${part.sizeY * 0.24} ${top + part.sizeX * 0.04}
        L ${part.sizeY * 0.12} ${bottom - part.sizeX * 0.08}
        L ${-part.sizeY * 0.06} ${bottom - part.sizeX * 0.04}
        Z" />
      <path class="detail" d="M ${-part.sizeY * 0.18} ${top + part.sizeX * 0.18} L ${part.sizeY * 0.14} ${bottom - part.sizeX * 0.22}" />
      <path class="highlight" d="M ${left + part.sizeY * 0.14} ${top + part.sizeX * 0.12} L ${right - part.sizeY * 0.16} ${top + part.sizeX * 0.2}" />
    `,
  );
}
