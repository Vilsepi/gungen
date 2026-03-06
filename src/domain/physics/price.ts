import { partPricePerGramCents } from "../../core/constants";
import { cents, Cents, Grams, PartKind } from "../../core/types";

export function computePrice(weight: Grams, pricePerGramCents: number): Cents {
  return cents(Math.round(Number(weight) * pricePerGramCents));
}

export function computePartPrice(kind: PartKind, weight: Grams): Cents {
  return computePrice(weight, partPricePerGramCents[kind]);
}
