import { SeedBundle } from "../core/types";
import { hashString } from "./hash";

export interface NormalizedSeeds {
  dataModelSeed: number;
  partSizeSeed: number;
  aestheticDetailSeed: number;
}

export function normalizeSeed(seed: string | number): number {
  if (typeof seed === "number" && Number.isFinite(seed)) {
    return seed >>> 0;
  }

  const trimmed = String(seed).trim();
  if (/^\d+$/.test(trimmed)) {
    return Number.parseInt(trimmed, 10) >>> 0;
  }

  return hashString(trimmed);
}

export function normalizeSeedBundle(bundle: SeedBundle): NormalizedSeeds {
  return {
    dataModelSeed: normalizeSeed(bundle.dataModelSeed),
    partSizeSeed: normalizeSeed(bundle.partSizeSeed),
    aestheticDetailSeed: normalizeSeed(bundle.aestheticDetailSeed),
  };
}

export function randomSeedString(): string {
  return Math.floor(Math.random() * 0xffffffff)
    .toString(16)
    .padStart(8, "0");
}
