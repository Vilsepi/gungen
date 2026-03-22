import { LayoutPart } from "../../core/types";
import { renderRoundedBody } from "./shared";

export function renderMagwell(part: LayoutPart): string {
  const inner = `<path d="M ${-part.length * 0.2} ${-part.width * 0.2} L ${part.length * 0.12} ${part.width * 0.18}" fill="none" opacity="0.5" />`;
  return renderRoundedBody(part, "part magwell", inner, 0.06);
}
