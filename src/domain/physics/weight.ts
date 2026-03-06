import { grams, Grams, mm2, SquareMillimeters } from "../../core/types";

export function computeArea(length: number, width: number): SquareMillimeters {
  return mm2(length * width);
}

export function computeWeight(area: SquareMillimeters, density: number): Grams {
  return grams(Number(area) * density);
}
