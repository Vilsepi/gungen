import { LayoutPart } from "../../core/types";
import { rangeInt } from "../../random/pick";
import { Prng } from "../../random/prng";
import { renderRoundedBody } from "./shared";

export function renderHandguard(part: LayoutPart, prng: Prng): string {
  const slots = rangeInt(prng, 3, 8);
  let inner = "";
  for (let index = 0; index < slots; index += 1) {
    const x =
      -part.length * 0.36 +
      index * ((part.length * 0.78) / Math.max(1, slots - 1));
    inner += `<rect x="${x}" y="${-part.width * 0.14}" width="${part.length * 0.08}" height="${part.width * 0.28}" rx="1" opacity="0.42" />`;
  }
  inner += `<line x1="${-part.length * 0.46}" y1="${-part.width * 0.22}" x2="${part.length * 0.46}" y2="${-part.width * 0.22}" opacity="0.45" />`;
  return renderRoundedBody(part, "part handguard", inner, 0.06);
}
