import { LayoutPart } from "../../core/types";
import { pickOne } from "../../random/pick";
import { Prng } from "../../random/prng";
import { renderPartGroup } from "./shared";

export function renderStock(part: LayoutPart, prng: Prng): string {
  const profile = pickOne(prng, [
    "lShaped",
    "skeleton",
    "collapsible",
  ] as const);
  const left = -part.length / 2;
  const right = part.length / 2;

  // AR-15 style stock geometry proportions
  const tubeH = part.width * 0.14; // buffer tube half-height (thin cylinder at bore axis)
  const padH = part.width * 0.44; // shoulder plate half-height
  const padW = part.length * 0.27; // shoulder plate width (from butt end)
  const wallT = part.width * 0.13; // skeleton frame wall thickness

  // Shell paths: each profile describes a modern AR-15 style stock silhouette
  const bodyByProfile = {
    // L/Γ-shape: thin buffer tube running rearward + wider shoulder plate at the butt end
    lShaped: `M ${right} ${-tubeH}
      L ${left + padW} ${-tubeH}
      L ${left + padW} ${-padH}
      L ${left} ${-padH}
      L ${left} ${padH}
      L ${left + padW} ${padH}
      L ${left + padW} ${tubeH}
      L ${right} ${tubeH}
      Z`,
    // Open triangle: spine rail along top, diagonal lower strut, vertical rear plate
    skeleton: `M ${right} ${-tubeH}
      L ${left} ${-padH * 0.65}
      L ${left} ${padH}
      L ${right} ${tubeH}
      Z`,
    // Collapsible: visible buffer tube with a sliding compact shoulder unit
    collapsible: `M ${right} ${-tubeH}
      L ${left + padW * 1.5} ${-tubeH}
      L ${left + padW * 1.5} ${-padH * 0.68}
      L ${left} ${-padH * 0.58}
      L ${left} ${padH * 0.58}
      L ${left + padW * 1.5} ${padH * 0.68}
      L ${left + padW * 1.5} ${tubeH}
      L ${right} ${tubeH}
      Z`,
  };

  // Void cutouts: interior details per profile
  const voidByProfile = {
    // Sling slot on the shoulder plate
    lShaped: `<path class="void" d="M ${left + part.length * 0.03} ${tubeH * 1.4} L ${left + padW - part.length * 0.02} ${tubeH * 1.4} L ${left + padW - part.length * 0.02} ${padH * 0.62} L ${left + part.length * 0.03} ${padH * 0.62} Z" />`,
    // Large open triangle cutout making the stock skeletal
    skeleton: `<path class="void" d="M ${right - wallT * 2} ${-tubeH + wallT} L ${left + wallT * 2} ${-padH * 0.65 + wallT * 1.8} L ${left + wallT * 2} ${padH - wallT * 1.8} L ${right - wallT * 2} ${tubeH - wallT} Z" />`,
    // Opening in the sliding stock body revealing the tube passing through
    collapsible: `<path class="void" d="M ${left + part.length * 0.04} ${-tubeH * 0.62} L ${left + padW * 1.4} ${-tubeH * 0.62} L ${left + padW * 1.4} ${tubeH * 0.62} L ${left + part.length * 0.04} ${tubeH * 0.62} Z" />`,
  };

  // Shade paths: shadow on the lower portion of each profile
  const shadeByProfile = {
    // Covers lower tube and lower shoulder plate for the L-shape
    lShaped: `<path class="shade" d="M ${left} ${padH * 0.4} L ${left + padW} ${tubeH} L ${right - part.length * 0.08} ${tubeH} L ${right - part.length * 0.04} ${tubeH * 0.5} L ${left + padW} ${padH} L ${left} ${padH} Z" />`,
    skeleton: `<path class="shade" d="M ${right - wallT * 2} ${tubeH - wallT} L ${left + wallT * 2} ${padH - wallT * 1.8} L ${left} ${padH} L ${right} ${tubeH} Z" />`,
    collapsible: `<path class="shade" d="M ${left + padW * 1.5} ${tubeH} L ${right - part.length * 0.08} ${tubeH} L ${right - part.length * 0.04} ${tubeH * 0.5} L ${left + padW * 1.5} ${padH * 0.68} Z" />`,
  };

  // Highlight paths: light edge along the top of each profile
  const highlightByProfile = {
    lShaped: `<path class="highlight" d="M ${left} ${-padH * 0.92} L ${left + padW} ${-tubeH * 0.8} L ${right - part.length * 0.06} ${-tubeH * 0.8}" />`,
    skeleton: `<path class="highlight" d="M ${right - wallT} ${-tubeH + wallT * 0.5} L ${left + wallT * 2} ${-padH * 0.65 + wallT}" />`,
    collapsible: `<path class="highlight" d="M ${left} ${-padH * 0.5} L ${left + padW * 1.5} ${-tubeH * 0.85} L ${right - part.length * 0.06} ${-tubeH * 0.85}" />`,
  };

  // Detail line along the buffer tube centerline (not shown for skeleton)
  const detailLine =
    profile === "skeleton"
      ? ""
      : `<path class="detail" d="M ${profile === "collapsible" ? left + padW * 1.5 : left + padW} 0 L ${right - part.length * 0.06} 0" />`;

  // Panel texture on the stock body (not shown for skeleton)
  // lShaped: covers the shoulder plate; collapsible: fits inside the sliding body
  const panelRect =
    profile === "skeleton"
      ? ""
      : profile === "collapsible"
        ? `<rect class="panel" x="${left + part.length * 0.04}" y="${-padH * 0.5}" width="${padW * 1.2}" height="${padH * 1.0}" rx="1.2" />`
        : `<rect class="panel" x="${left + part.length * 0.03}" y="${-padH * 0.85}" width="${padW * 0.78}" height="${padH * 1.62}" rx="1.2" />`;

  return renderPartGroup(
    part,
    "part stock",
    `
      <path class="shell" d="${bodyByProfile[profile]}" />
      ${voidByProfile[profile]}
      ${shadeByProfile[profile]}
      ${highlightByProfile[profile]}
      ${detailLine}
      ${panelRect}
    `,
  );
}
