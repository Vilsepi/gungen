import { LayoutPart } from "../../core/types";
import { renderRoundedBody } from "./shared";

export function renderBarrel(part: LayoutPart): string {
  const inner = `<line x1="${-part.length / 2}" y1="0" x2="${part.length / 2}" y2="0" opacity="0.45" />`;
  return renderRoundedBody(part, "part barrel", inner, 0.4);
}
