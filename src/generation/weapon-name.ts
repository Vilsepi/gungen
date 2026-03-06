import { SeedBundle, WeaponCategory } from "../core/types";
import { hashString } from "../random/hash";

const categoryPrefixes: Record<WeaponCategory, string> = {
  Pistol: "P",
  SMG: "MP",
  Carbine: "C",
  AssaultRifle: "AR",
  BattleRifle: "BR",
  DMR: "DMR",
  Sniper: "S",
};

const base32Alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

function encodeBase32(bytes: Uint8Array): string {
  let encoded = "";
  let buffer = 0;
  let bitsInBuffer = 0;

  for (const byte of bytes) {
    buffer = (buffer << 8) | byte;
    bitsInBuffer += 8;

    while (bitsInBuffer >= 5) {
      bitsInBuffer -= 5;
      encoded += base32Alphabet[(buffer >> bitsInBuffer) & 31];
    }
  }

  if (bitsInBuffer > 0) {
    encoded += base32Alphabet[(buffer << (5 - bitsInBuffer)) & 31];
  }

  return encoded;
}

function hashToBytes(hash: number): [number, number, number, number] {
  return [
    (hash >>> 24) & 255,
    (hash >>> 16) & 255,
    (hash >>> 8) & 255,
    hash & 255,
  ];
}

export function createWeaponName(seeds: SeedBundle): string {
  const hashes = [
    hashString(seeds.dataModelSeed),
    hashString(seeds.partSizeSeed),
    hashString(seeds.aestheticDetailSeed),
  ];
  const bytes = new Uint8Array(hashes.flatMap(hashToBytes));
  const prefix = categoryPrefixes[seeds.category];
  const asciiHash = encodeBase32(bytes);

  return `${prefix}-${asciiHash}`;
}
