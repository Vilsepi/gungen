import { LayoutPart } from "../../core/types";

export function renderHandStop(part: LayoutPart): string {
  return `
    <g class="part hand-stop" transform="translate(${part.x} ${part.y}) rotate(${part.rotationDeg})">
      <path d="M ${-part.length / 2} ${part.width / 2} L 0 ${-part.width / 2} L ${part.length / 2} ${part.width / 2} Z" />
    </g>
  `;
}
