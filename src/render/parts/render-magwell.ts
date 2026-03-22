import { LayoutPart } from "../../core/types";
import { renderPartGroup } from "./shared";

export function renderMagwell(part: LayoutPart): string {
  const left = -part.sizeX / 2;
  const right = part.sizeX / 2;
  const top = -part.sizeY / 2;
  const bottom = part.sizeY / 2;

  return renderPartGroup(
    part,
    "part magwell",
    `
      <path class="shell" d="M ${left} ${top + part.sizeY * 0.04}
        L ${right} ${top}
        L ${part.sizeX * 0.34} ${bottom - part.sizeY * 0.2}
        L ${part.sizeX * 0.18} ${bottom}
        L ${-part.sizeX * 0.18} ${bottom}
        L ${-part.sizeX * 0.34} ${bottom - part.sizeY * 0.16}
        Z" />
      <path class="shade" d="M ${-part.sizeX * 0.04} ${top + part.sizeY * 0.08}
        L ${part.sizeX * 0.24} ${top + part.sizeY * 0.04}
        L ${part.sizeX * 0.12} ${bottom - part.sizeY * 0.08}
        L ${-part.sizeX * 0.06} ${bottom - part.sizeY * 0.04}
        Z" />
      <path class="detail" d="M ${-part.sizeX * 0.18} ${top + part.sizeY * 0.18} L ${part.sizeX * 0.14} ${bottom - part.sizeY * 0.22}" />
      <path class="highlight" d="M ${left + part.sizeX * 0.14} ${top + part.sizeY * 0.12} L ${right - part.sizeX * 0.16} ${top + part.sizeY * 0.2}" />
    `,
  );
}
