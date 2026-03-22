import { Prng } from "./prng";

export function chance(prng: Prng, probability: number): boolean {
  return prng.next() < probability;
}

export function rangeInt(
  prng: Prng,
  minInclusive: number,
  maxInclusive: number,
): number {
  return prng.nextInt(minInclusive, maxInclusive);
}

export function rangeFloat(
  prng: Prng,
  minInclusive: number,
  maxInclusive: number,
): number {
  return prng.nextRange(minInclusive, maxInclusive);
}

export function pickOne<T>(prng: Prng, values: readonly T[]): T {
  const selected = values[rangeInt(prng, 0, values.length - 1)];
  if (selected === undefined) {
    throw new Error("Cannot pick from an empty list.");
  }
  return selected;
}

export function pickByOdds<T extends string>(
  prng: Prng,
  odds: Partial<Record<T, number>>,
): T | null {
  const entries = (
    Object.entries(odds) as Array<[T, number | undefined]>
  ).filter((entry): entry is [T, number] => (entry[1] ?? 0) > 0);
  const total = entries.reduce((sum, [, oddsValue]) => sum + oddsValue, 0);
  if (total <= 0) {
    return null;
  }

  let cursor = prng.nextRange(0, total);
  for (const [value, oddsValue] of entries) {
    cursor -= oddsValue;
    if (cursor <= 0) {
      return value;
    }
  }

  return entries.at(-1)?.[0] ?? null;
}
