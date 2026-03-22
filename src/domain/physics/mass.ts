import { grams, Grams, mm2, SquareMillimeters } from "../../core/types";

export function computeArea(sizeX: number, sizeY: number): SquareMillimeters {
  return mm2(sizeX * sizeY);
}

export function computeMass(area: SquareMillimeters, density: number): Grams {
  return grams(Number(area) * density);
}
