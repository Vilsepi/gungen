import { LayoutPart } from "../../core/types";
import { renderRoundedBody } from "./shared";

export function renderFlashlight(part: LayoutPart): string {
  return renderRoundedBody(
    part,
    "part flashlight",
    `<circle cx="${part.length * 0.3}" cy="0" r="${part.width * 0.16}" opacity="0.45" />`,
    0.35,
  );
}
