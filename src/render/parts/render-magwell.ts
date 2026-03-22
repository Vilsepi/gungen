import { LayoutPart } from "../../core/types";
import { renderPartGroup } from "./shared";

export function renderMagwell(part: LayoutPart): string {
  const left = -part.width / 2;
  const right = part.width / 2;
  const top = -part.length / 2;
  const bottom = part.length / 2;

  return renderPartGroup(
    part,
    "part magwell",
    `
      <path class="shell" d="M ${left} ${top + part.length * 0.04}
        L ${right} ${top}
        L ${part.width * 0.34} ${bottom - part.length * 0.2}
        L ${part.width * 0.18} ${bottom}
        L ${-part.width * 0.18} ${bottom}
        L ${-part.width * 0.34} ${bottom - part.length * 0.16}
        Z" />
      <path class="shade" d="M ${-part.width * 0.04} ${top + part.length * 0.08}
        L ${part.width * 0.24} ${top + part.length * 0.04}
        L ${part.width * 0.12} ${bottom - part.length * 0.08}
        L ${-part.width * 0.06} ${bottom - part.length * 0.04}
        Z" />
      <path class="detail" d="M ${-part.width * 0.18} ${top + part.length * 0.18} L ${part.width * 0.14} ${bottom - part.length * 0.22}" />
      <path class="highlight" d="M ${left + part.width * 0.14} ${top + part.length * 0.12} L ${right - part.width * 0.16} ${top + part.length * 0.2}" />
    `,
  );
}
