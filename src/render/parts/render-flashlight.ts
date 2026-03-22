import { LayoutPart } from "../../core/types";
import { renderPartGroup } from "./shared";

export function renderFlashlight(part: LayoutPart): string {
  const bodySizeX = part.sizeX * 0.52;
  const bezelSizeX = part.sizeX * 0.22;
  const tailSizeX = part.sizeX * 0.16;
  const bodySizeY = part.sizeY * 0.68;
  const bezelSizeY = part.sizeY * 0.88;
  const mountSizeY = part.sizeY * 0.28;
  const tailLeft = -part.sizeX / 2;
  const bodyLeft = tailLeft + tailSizeX;
  const bezelLeft = bodyLeft + bodySizeX;

  return renderPartGroup(
    part,
    "part flashlight",
    `
      <rect class="shell" x="${bodyLeft}" y="${-bodySizeY / 2}" width="${bodySizeX}" height="${bodySizeY}" rx="${Math.max(2, part.sizeY * 0.14)}" />
      <rect class="shell" x="${tailLeft}" y="${-bodySizeY * 0.42}" width="${tailSizeX}" height="${bodySizeY * 0.84}" rx="${Math.max(1.8, part.sizeY * 0.12)}" />
      <path class="shell" d="M ${bezelLeft} ${-bezelSizeY / 2}
        L ${part.sizeX / 2 - part.sizeX * 0.04} ${-bezelSizeY * 0.38}
        L ${part.sizeX / 2} 0
        L ${part.sizeX / 2 - part.sizeX * 0.04} ${bezelSizeY * 0.38}
        L ${bezelLeft} ${bezelSizeY / 2}
        Z" />
      <rect class="panel" x="${bodyLeft + bodySizeX * 0.1}" y="${-bodySizeY * 0.28}" width="${bodySizeX * 0.52}" height="${bodySizeY * 0.56}" rx="1.2" />
      <rect class="shade" x="${bodyLeft + bodySizeX * 0.18}" y="${-bodySizeY * 0.18}" width="${bodySizeX * 0.58}" height="${bodySizeY * 0.36}" rx="1" />
      <rect class="panel" x="${-part.sizeX * 0.12}" y="${bodySizeY / 2}" width="${part.sizeX * 0.24}" height="${mountSizeY}" rx="1.2" />
      <circle class="void" cx="${part.sizeX / 2 - bezelSizeX * 0.32}" cy="0" r="${part.sizeY * 0.17}" />
      <path class="highlight" d="M ${tailLeft + tailSizeX * 0.18} ${-bodySizeY * 0.22} L ${bodyLeft + bodySizeX * 0.74} ${-bodySizeY * 0.22}" />
      <path class="detail" d="M ${bodyLeft + bodySizeX * 0.18} ${bodySizeY * 0.22} L ${bezelLeft - bodySizeX * 0.06} ${bodySizeY * 0.22}" />
    `,
  );
}
