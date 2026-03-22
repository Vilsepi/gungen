import {
  partLevelPriceMultipliers,
  partPricePerGramCents,
} from "../../core/constants";
import { cents, Cents, Grams, PartKind, PartLevel } from "../../core/types";

export function computePrice(
  mass: Grams,
  pricePerGramCents: number,
  multiplier = 1,
): Cents {
  return cents(Math.round(Number(mass) * pricePerGramCents * multiplier));
}

export function computePartPrice(
  kind: PartKind,
  mass: Grams,
  partLevel: PartLevel,
): Cents {
  return computePrice(
    mass,
    partPricePerGramCents[kind],
    partLevelPriceMultipliers[partLevel],
  );
}
