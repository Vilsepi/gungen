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
  const left = -part.sizeX / 2;
  const right = part.sizeX / 2;

  // AR-15 style stock geometry proportions
  const tubeHalfSizeY = part.sizeY * 0.14; // buffer tube half-size on the Y axis
  const padHalfSizeY = part.sizeY * 0.44; // shoulder plate half-size on the Y axis
  const padSizeX = part.sizeX * 0.27; // shoulder plate size on the X axis from the butt end
  const wallT = part.sizeY * 0.13; // skeleton frame wall thickness

  // Shell paths: each profile describes a modern AR-15 style stock silhouette
  const bodyByProfile = {
    // L/Γ-shape: thin buffer tube running rearward + wider shoulder plate at the butt end
    lShaped: `M ${right} ${-tubeHalfSizeY}
      L ${left + padSizeX} ${-tubeHalfSizeY}
      L ${left + padSizeX} ${-padHalfSizeY}
      L ${left} ${-padHalfSizeY}
      L ${left} ${padHalfSizeY}
      L ${left + padSizeX} ${padHalfSizeY}
      L ${left + padSizeX} ${tubeHalfSizeY}
      L ${right} ${tubeHalfSizeY}
      Z`,
    // Open triangle: spine rail along top, diagonal lower strut, vertical rear plate
    skeleton: `M ${right} ${-tubeHalfSizeY}
      L ${left} ${-padHalfSizeY * 0.65}
      L ${left} ${padHalfSizeY}
      L ${right} ${tubeHalfSizeY}
      Z`,
    // Collapsible: visible buffer tube with a sliding compact shoulder unit
    collapsible: `M ${right} ${-tubeHalfSizeY}
      L ${left + padSizeX * 1.5} ${-tubeHalfSizeY}
      L ${left + padSizeX * 1.5} ${-padHalfSizeY * 0.68}
      L ${left} ${-padHalfSizeY * 0.58}
      L ${left} ${padHalfSizeY * 0.58}
      L ${left + padSizeX * 1.5} ${padHalfSizeY * 0.68}
      L ${left + padSizeX * 1.5} ${tubeHalfSizeY}
      L ${right} ${tubeHalfSizeY}
      Z`,
  };

  // Void cutouts: interior details per profile
  const voidByProfile = {
    // Sling slot on the shoulder plate
    lShaped: `<path class="void" d="M ${left + part.sizeX * 0.03} ${tubeHalfSizeY * 1.4} L ${left + padSizeX - part.sizeX * 0.02} ${tubeHalfSizeY * 1.4} L ${left + padSizeX - part.sizeX * 0.02} ${padHalfSizeY * 0.62} L ${left + part.sizeX * 0.03} ${padHalfSizeY * 0.62} Z" />`,
    // Large open triangle cutout making the stock skeletal
    skeleton: `<path class="void" d="M ${right - wallT * 2} ${-tubeHalfSizeY + wallT} L ${left + wallT * 2} ${-padHalfSizeY * 0.65 + wallT * 1.8} L ${left + wallT * 2} ${padHalfSizeY - wallT * 1.8} L ${right - wallT * 2} ${tubeHalfSizeY - wallT} Z" />`,
    // Opening in the sliding stock body revealing the tube passing through
    collapsible: `<path class="void" d="M ${left + part.sizeX * 0.04} ${-tubeHalfSizeY * 0.62} L ${left + padSizeX * 1.4} ${-tubeHalfSizeY * 0.62} L ${left + padSizeX * 1.4} ${tubeHalfSizeY * 0.62} L ${left + part.sizeX * 0.04} ${tubeHalfSizeY * 0.62} Z" />`,
  };

  // Shade paths: shadow on the lower portion of each profile
  const shadeByProfile = {
    // Covers lower tube and lower shoulder plate for the L-shape
    lShaped: `<path class="shade" d="M ${left} ${padHalfSizeY * 0.4} L ${left + padSizeX} ${tubeHalfSizeY} L ${right - part.sizeX * 0.08} ${tubeHalfSizeY} L ${right - part.sizeX * 0.04} ${tubeHalfSizeY * 0.5} L ${left + padSizeX} ${padHalfSizeY} L ${left} ${padHalfSizeY} Z" />`,
    skeleton: `<path class="shade" d="M ${right - wallT * 2} ${tubeHalfSizeY - wallT} L ${left + wallT * 2} ${padHalfSizeY - wallT * 1.8} L ${left} ${padHalfSizeY} L ${right} ${tubeHalfSizeY} Z" />`,
    collapsible: `<path class="shade" d="M ${left + padSizeX * 1.5} ${tubeHalfSizeY} L ${right - part.sizeX * 0.08} ${tubeHalfSizeY} L ${right - part.sizeX * 0.04} ${tubeHalfSizeY * 0.5} L ${left + padSizeX * 1.5} ${padHalfSizeY * 0.68} Z" />`,
  };

  // Highlight paths: light edge along the top of each profile
  const highlightByProfile = {
    lShaped: `<path class="highlight" d="M ${left} ${-padHalfSizeY * 0.92} L ${left + padSizeX} ${-tubeHalfSizeY * 0.8} L ${right - part.sizeX * 0.06} ${-tubeHalfSizeY * 0.8}" />`,
    skeleton: `<path class="highlight" d="M ${right - wallT} ${-tubeHalfSizeY + wallT * 0.5} L ${left + wallT * 2} ${-padHalfSizeY * 0.65 + wallT}" />`,
    collapsible: `<path class="highlight" d="M ${left} ${-padHalfSizeY * 0.5} L ${left + padSizeX * 1.5} ${-tubeHalfSizeY * 0.85} L ${right - part.sizeX * 0.06} ${-tubeHalfSizeY * 0.85}" />`,
  };

  // Detail line along the buffer tube centerline (not shown for skeleton)
  const detailLine =
    profile === "skeleton"
      ? ""
      : `<path class="detail" d="M ${profile === "collapsible" ? left + padSizeX * 1.5 : left + padSizeX} 0 L ${right - part.sizeX * 0.06} 0" />`;

  // Panel texture on the stock body (not shown for skeleton)
  // lShaped: covers the shoulder plate; collapsible: fits inside the sliding body
  const panelRect =
    profile === "skeleton"
      ? ""
      : profile === "collapsible"
        ? `<rect class="panel" x="${left + part.sizeX * 0.04}" y="${-padHalfSizeY * 0.5}" width="${padSizeX * 1.2}" height="${padHalfSizeY * 1.0}" rx="1.2" />`
        : `<rect class="panel" x="${left + part.sizeX * 0.03}" y="${-padHalfSizeY * 0.85}" width="${padSizeX * 0.78}" height="${padHalfSizeY * 1.62}" rx="1.2" />`;

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
