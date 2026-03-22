import { LayoutPart } from "../../core/types";
import { rangeInt } from "../../random/pick";
import { Prng } from "../../random/prng";
import { renderRoundedBody } from "./shared";

export function renderMuzzleDevice(part: LayoutPart, prng: Prng): string {
  const slots = rangeInt(prng, 2, 5);
  let inner = "";
  for (let index = 0; index < slots; index += 1) {
    const x = -part.sizeX * 0.22 + index * (part.sizeX * 0.18);
    inner += `<line x1="${x}" y1="${-part.sizeY * 0.28}" x2="${x}" y2="${part.sizeY * 0.28}" opacity="0.42" />`;
  }
  return renderRoundedBody(part, "part muzzle-device", inner, 0.07);
}
