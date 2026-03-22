import { LayoutPart } from "../../core/types";
import { renderRoundedBody } from "./shared";

export function renderLaser(part: LayoutPart): string {
  return renderRoundedBody(
    part,
    "part laser",
    `<circle cx="${part.sizeX * 0.24}" cy="0" r="${part.sizeY * 0.12}" opacity="0.7" />`,
    0.06,
  );
}
