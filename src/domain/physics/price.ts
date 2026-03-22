import {
  partLevelPriceMultipliers,
  partPricePerGramCents,
} from "../../core/constants";
import { cents, Cents, Grams, PartKind, PartLevel } from "../../core/types";

export function computePrice(
  weight: Grams,
  pricePerGramCents: number,
  multiplier = 1,
): Cents {
  return cents(Math.round(Number(weight) * pricePerGramCents * multiplier));
}

export function computePartPrice(
  kind: PartKind,
  weight: Grams,
  partLevel: PartLevel,
): Cents {
  return computePrice(
    weight,
    partPricePerGramCents[kind],
    partLevelPriceMultipliers[partLevel],
  );
}
