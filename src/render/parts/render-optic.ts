import { LayoutPart } from "../../core/types";
import { pickOne } from "../../random/pick";
import { Prng } from "../../random/prng";
import { renderPartGroup } from "./shared";

export function renderOptic(part: LayoutPart, prng: Prng): string {
  const aspectRatio = part.length / Math.max(part.width, 1);
  const longScope = aspectRatio > 3.3 && part.length > 118;
  const profile = longScope
    ? pickOne(prng, ["lpvo", "tube"] as const)
    : pickOne(prng, ["holo", "red-dot"] as const);
  const shellHeight = part.width * 0.72;
  const bodyTop = -shellHeight - part.width * 0.08;
  const bodyBottom = -part.width * 0.1;
  const mountTop = part.width * 0.02;
  const mountHeight = part.width * 0.24;
  const ringWidth = Math.max(part.length * 0.08, 8);

  const bodyByProfile = {
    holo: `
      <path class="shell" d="M ${-part.length * 0.34} ${bodyBottom}
        L ${-part.length * 0.26} ${bodyTop + shellHeight * 0.22}
        L ${part.length * 0.14} ${bodyTop}
        L ${part.length * 0.28} ${bodyTop + shellHeight * 0.2}
        L ${part.length * 0.32} ${bodyBottom}
        Z" />
      <path class="void" d="M ${-part.length * 0.14} ${bodyBottom - shellHeight * 0.08}
        L ${-part.length * 0.08} ${bodyTop + shellHeight * 0.3}
        L ${part.length * 0.12} ${bodyTop + shellHeight * 0.18}
        L ${part.length * 0.15} ${bodyBottom - shellHeight * 0.08}
        Z" />`,
    "red-dot": `
      <path class="shell" d="M ${-part.length * 0.32} ${bodyBottom}
        Q ${-part.length * 0.18} ${bodyTop + shellHeight * 0.02} 0 ${bodyTop}
        Q ${part.length * 0.18} ${bodyTop + shellHeight * 0.02} ${part.length * 0.32} ${bodyBottom}
        L ${part.length * 0.24} ${bodyBottom + shellHeight * 0.06}
        L ${-part.length * 0.24} ${bodyBottom + shellHeight * 0.06}
        Z" />
      <path class="detail" d="M ${-part.length * 0.14} ${bodyTop + shellHeight * 0.36} L ${part.length * 0.14} ${bodyTop + shellHeight * 0.36}" />`,
    lpvo: `
      <ellipse class="shell" cx="${-part.length * 0.36}" cy="${bodyTop + shellHeight * 0.52}" rx="${part.length * 0.11}" ry="${shellHeight * 0.32}" />
      <rect class="shell" x="${-part.length * 0.26}" y="${bodyTop + shellHeight * 0.3}" width="${part.length * 0.5}" height="${shellHeight * 0.42}" rx="${Math.max(2, part.width * 0.12)}" />
      <ellipse class="shell" cx="${part.length * 0.3}" cy="${bodyTop + shellHeight * 0.52}" rx="${part.length * 0.15}" ry="${shellHeight * 0.4}" />
      <rect class="panel" x="${-ringWidth * 1.1}" y="${bodyTop + shellHeight * 0.22}" width="${ringWidth}" height="${shellHeight * 0.58}" rx="1.2" />
      <rect class="panel" x="${ringWidth * 0.1}" y="${bodyTop + shellHeight * 0.22}" width="${ringWidth}" height="${shellHeight * 0.58}" rx="1.2" />`,
    tube: `
      <ellipse class="shell" cx="${-part.length * 0.34}" cy="${bodyTop + shellHeight * 0.5}" rx="${part.length * 0.11}" ry="${shellHeight * 0.28}" />
      <rect class="shell" x="${-part.length * 0.24}" y="${bodyTop + shellHeight * 0.32}" width="${part.length * 0.44}" height="${shellHeight * 0.36}" rx="${Math.max(2, part.width * 0.12)}" />
      <ellipse class="shell" cx="${part.length * 0.26}" cy="${bodyTop + shellHeight * 0.5}" rx="${part.length * 0.13}" ry="${shellHeight * 0.32}" />
      <rect class="panel" x="${-ringWidth * 1.05}" y="${bodyTop + shellHeight * 0.22}" width="${ringWidth}" height="${shellHeight * 0.56}" rx="1.2" />
      <rect class="panel" x="${ringWidth * 0.05}" y="${bodyTop + shellHeight * 0.22}" width="${ringWidth}" height="${shellHeight * 0.56}" rx="1.2" />`,
  };

  return renderPartGroup(
    part,
    "part optic",
    `
      ${bodyByProfile[profile]}
      <rect class="panel" x="${-part.length * 0.18}" y="${mountTop}" width="${part.length * 0.36}" height="${mountHeight}" rx="1.4" />
      <rect class="shade" x="${-part.length * 0.1}" y="${mountTop + part.width * 0.04}" width="${part.length * 0.2}" height="${mountHeight - part.width * 0.06}" rx="1" />
      <path class="detail" d="M ${-part.length * 0.2} ${bodyTop + shellHeight * 0.5} L ${part.length * 0.2} ${bodyTop + shellHeight * 0.5}" />
      <path class="highlight" d="M ${-part.length * 0.18} ${bodyTop + shellHeight * 0.18} L ${part.length * 0.14} ${bodyTop + shellHeight * 0.12}" />
      <circle class="pin" cx="${-part.length * 0.14}" cy="${mountTop + mountHeight / 2}" r="${Math.max(1.1, part.width * 0.04)}" />
      <circle class="pin" cx="${part.length * 0.14}" cy="${mountTop + mountHeight / 2}" r="${Math.max(1.1, part.width * 0.04)}" />
    `,
  );
}
