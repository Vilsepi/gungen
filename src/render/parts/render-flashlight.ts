import { LayoutPart } from "../../core/types";
import { renderPartGroup } from "./shared";

export function renderFlashlight(part: LayoutPart): string {
  const bodyLength = part.length * 0.52;
  const bezelLength = part.length * 0.22;
  const tailLength = part.length * 0.16;
  const bodyHeight = part.width * 0.68;
  const bezelHeight = part.width * 0.88;
  const mountHeight = part.width * 0.28;
  const tailLeft = -part.length / 2;
  const bodyLeft = tailLeft + tailLength;
  const bezelLeft = bodyLeft + bodyLength;

  return renderPartGroup(
    part,
    "part flashlight",
    `
      <rect class="shell" x="${bodyLeft}" y="${-bodyHeight / 2}" width="${bodyLength}" height="${bodyHeight}" rx="${Math.max(2, part.width * 0.14)}" />
      <rect class="shell" x="${tailLeft}" y="${-bodyHeight * 0.42}" width="${tailLength}" height="${bodyHeight * 0.84}" rx="${Math.max(1.8, part.width * 0.12)}" />
      <path class="shell" d="M ${bezelLeft} ${-bezelHeight / 2}
        L ${part.length / 2 - part.length * 0.04} ${-bezelHeight * 0.38}
        L ${part.length / 2} 0
        L ${part.length / 2 - part.length * 0.04} ${bezelHeight * 0.38}
        L ${bezelLeft} ${bezelHeight / 2}
        Z" />
      <rect class="panel" x="${bodyLeft + bodyLength * 0.1}" y="${-bodyHeight * 0.28}" width="${bodyLength * 0.52}" height="${bodyHeight * 0.56}" rx="1.2" />
      <rect class="shade" x="${bodyLeft + bodyLength * 0.18}" y="${-bodyHeight * 0.18}" width="${bodyLength * 0.58}" height="${bodyHeight * 0.36}" rx="1" />
      <rect class="panel" x="${-part.length * 0.12}" y="${bodyHeight / 2}" width="${part.length * 0.24}" height="${mountHeight}" rx="1.2" />
      <circle class="void" cx="${part.length / 2 - bezelLength * 0.32}" cy="0" r="${part.width * 0.17}" />
      <path class="highlight" d="M ${tailLeft + tailLength * 0.18} ${-bodyHeight * 0.22} L ${bodyLeft + bodyLength * 0.74} ${-bodyHeight * 0.22}" />
      <path class="detail" d="M ${bodyLeft + bodyLength * 0.18} ${bodyHeight * 0.22} L ${bezelLeft - bodyLength * 0.06} ${bodyHeight * 0.22}" />
    `,
  );
}
