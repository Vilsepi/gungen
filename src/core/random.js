export function createMulberry32(seed) {
  return function random() {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function hashSeed(input) {
  let hash = 2166136261;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function createRng(seedText) {
  return createMulberry32(hashSeed(seedText));
}

export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function lerp(min, max, t) {
  return min + (max - min) * t;
}

export function range(rng, min, max) {
  return lerp(min, max, rng());
}

export function intRange(rng, min, max) {
  return Math.round(range(rng, min, max));
}

export function chance(rng, probability) {
  return rng() < probability;
}

export function pick(rng, values) {
  return values[Math.floor(rng() * values.length)];
}

export function weightedPick(rng, values) {
  const total = values.reduce((sum, item) => sum + item.weight, 0);
  let roll = rng() * total;
  for (const item of values) {
    roll -= item.weight;
    if (roll <= 0) {
      return item.value;
    }
  }
  return values[values.length - 1].value;
}

export function createSeed() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
