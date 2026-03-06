export function transformTranslateRotate(
  x: number,
  y: number,
  rotationDeg: number,
): string {
  return `translate(${x} ${y}) rotate(${rotationDeg})`;
}
