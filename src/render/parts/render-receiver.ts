import { LayoutPart } from "../../core/types";
import { rangeInt } from "../../random/pick";
import { Prng } from "../../random/prng";
import { line, renderRoundedBody } from "./shared";

export function renderReceiver(part: LayoutPart, prng: Prng): string {
  const cuts = rangeInt(prng, 2, 4);
  let inner = line(-part.length * 0.32, 0, part.length * 0.26, 0, 0.65);
  for (let index = 0; index < cuts; index += 1) {
    const x = -part.length * 0.28 + index * (part.length * 0.14);
    inner += `<rect x="${x}" y="${-part.width * 0.12}" width="${part.length * 0.07}" height="${part.width * 0.24}" rx="1" opacity="0.55" />`;
  }
  inner += `<path d="M ${part.length * 0.18} ${-part.width * 0.22} q ${part.length * 0.14} ${part.width * 0.18} 0 ${part.width * 0.36}" fill="none" opacity="0.5" />`;
  return renderRoundedBody(part, "part receiver", inner, 0.07);
}
