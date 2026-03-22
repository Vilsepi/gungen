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
  let bits = 0;

  for (const byte of bytes) {
    buffer = (buffer << 8) | byte;
    bits += 8;

    while (bits >= 5) {
      bits -= 5;
      encoded += base32Alphabet[(buffer >> bits) & 31];
    }
  }

  return bits ? encoded + base32Alphabet[(buffer << (5 - bits)) & 31] : encoded;
}

export function createWeaponName(seeds: SeedBundle): string {
  const hash = hashString(
    [seeds.dataModelSeed, seeds.partSizeSeed, seeds.aestheticDetailSeed].join(
      "\0",
    ),
  );
  const bytes = new Uint8Array([
    (hash >>> 24) & 255,
    (hash >>> 16) & 255,
    (hash >>> 8) & 255,
    hash & 255,
  ]);

  return `${categoryPrefixes[seeds.category]}-${encodeBase32(bytes)}`;
}
