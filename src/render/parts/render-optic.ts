import { LayoutPart } from "../../core/types";
import { pickOne } from "../../random/pick";
import { Prng } from "../../random/prng";
import { renderPartGroup } from "./shared";

export function renderOptic(part: LayoutPart, prng: Prng): string {
  const aspectRatio = part.sizeX / Math.max(part.sizeY, 1);
  const longScope = aspectRatio > 3.3 && part.sizeX > 118;
  const profile = longScope
    ? pickOne(prng, ["lpvo", "tube"] as const)
    : pickOne(prng, ["holo", "red-dot"] as const);
  const shellSizeY = part.sizeY * 0.72;
  const bodyTop = -shellSizeY - part.sizeY * 0.08;
  const bodyBottom = -part.sizeY * 0.1;
  const mountTop = part.sizeY * 0.02;
  const mountSizeY = part.sizeY * 0.24;
  const ringSizeX = Math.max(part.sizeX * 0.08, 8);

  const bodyByProfile = {
    holo: `
      <path class="shell" d="M ${-part.sizeX * 0.34} ${bodyBottom}
        L ${-part.sizeX * 0.26} ${bodyTop + shellSizeY * 0.22}
        L ${part.sizeX * 0.14} ${bodyTop}
        L ${part.sizeX * 0.28} ${bodyTop + shellSizeY * 0.2}
        L ${part.sizeX * 0.32} ${bodyBottom}
        Z" />
      <path class="void" d="M ${-part.sizeX * 0.14} ${bodyBottom - shellSizeY * 0.08}
        L ${-part.sizeX * 0.08} ${bodyTop + shellSizeY * 0.3}
        L ${part.sizeX * 0.12} ${bodyTop + shellSizeY * 0.18}
        L ${part.sizeX * 0.15} ${bodyBottom - shellSizeY * 0.08}
        Z" />`,
    "red-dot": `
      <path class="shell" d="M ${-part.sizeX * 0.32} ${bodyBottom}
        Q ${-part.sizeX * 0.18} ${bodyTop + shellSizeY * 0.02} 0 ${bodyTop}
        Q ${part.sizeX * 0.18} ${bodyTop + shellSizeY * 0.02} ${part.sizeX * 0.32} ${bodyBottom}
        L ${part.sizeX * 0.24} ${bodyBottom + shellSizeY * 0.06}
        L ${-part.sizeX * 0.24} ${bodyBottom + shellSizeY * 0.06}
        Z" />
      <path class="detail" d="M ${-part.sizeX * 0.14} ${bodyTop + shellSizeY * 0.36} L ${part.sizeX * 0.14} ${bodyTop + shellSizeY * 0.36}" />`,
    lpvo: `
      <ellipse class="shell" cx="${-part.sizeX * 0.36}" cy="${bodyTop + shellSizeY * 0.52}" rx="${part.sizeX * 0.11}" ry="${shellSizeY * 0.32}" />
      <rect class="shell" x="${-part.sizeX * 0.26}" y="${bodyTop + shellSizeY * 0.3}" width="${part.sizeX * 0.5}" height="${shellSizeY * 0.42}" rx="${Math.max(2, part.sizeY * 0.12)}" />
      <ellipse class="shell" cx="${part.sizeX * 0.3}" cy="${bodyTop + shellSizeY * 0.52}" rx="${part.sizeX * 0.15}" ry="${shellSizeY * 0.4}" />
      <rect class="panel" x="${-ringSizeX * 1.1}" y="${bodyTop + shellSizeY * 0.22}" width="${ringSizeX}" height="${shellSizeY * 0.58}" rx="1.2" />
      <rect class="panel" x="${ringSizeX * 0.1}" y="${bodyTop + shellSizeY * 0.22}" width="${ringSizeX}" height="${shellSizeY * 0.58}" rx="1.2" />`,
    tube: `
      <ellipse class="shell" cx="${-part.sizeX * 0.34}" cy="${bodyTop + shellSizeY * 0.5}" rx="${part.sizeX * 0.11}" ry="${shellSizeY * 0.28}" />
      <rect class="shell" x="${-part.sizeX * 0.24}" y="${bodyTop + shellSizeY * 0.32}" width="${part.sizeX * 0.44}" height="${shellSizeY * 0.36}" rx="${Math.max(2, part.sizeY * 0.12)}" />
      <ellipse class="shell" cx="${part.sizeX * 0.26}" cy="${bodyTop + shellSizeY * 0.5}" rx="${part.sizeX * 0.13}" ry="${shellSizeY * 0.32}" />
      <rect class="panel" x="${-ringSizeX * 1.05}" y="${bodyTop + shellSizeY * 0.22}" width="${ringSizeX}" height="${shellSizeY * 0.56}" rx="1.2" />
      <rect class="panel" x="${ringSizeX * 0.05}" y="${bodyTop + shellSizeY * 0.22}" width="${ringSizeX}" height="${shellSizeY * 0.56}" rx="1.2" />`,
  };

  return renderPartGroup(
    part,
    "part optic",
    `
      ${bodyByProfile[profile]}
      <rect class="panel" x="${-part.sizeX * 0.18}" y="${mountTop}" width="${part.sizeX * 0.36}" height="${mountSizeY}" rx="1.4" />
      <rect class="shade" x="${-part.sizeX * 0.1}" y="${mountTop + part.sizeY * 0.04}" width="${part.sizeX * 0.2}" height="${mountSizeY - part.sizeY * 0.06}" rx="1" />
      <path class="detail" d="M ${-part.sizeX * 0.2} ${bodyTop + shellSizeY * 0.5} L ${part.sizeX * 0.2} ${bodyTop + shellSizeY * 0.5}" />
      <path class="highlight" d="M ${-part.sizeX * 0.18} ${bodyTop + shellSizeY * 0.18} L ${part.sizeX * 0.14} ${bodyTop + shellSizeY * 0.12}" />
      <circle class="pin" cx="${-part.sizeX * 0.14}" cy="${mountTop + mountSizeY / 2}" r="${Math.max(1.1, part.sizeY * 0.04)}" />
      <circle class="pin" cx="${part.sizeX * 0.14}" cy="${mountTop + mountSizeY / 2}" r="${Math.max(1.1, part.sizeY * 0.04)}" />
    `,
  );
}
