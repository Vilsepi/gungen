export interface Prng {
  next(): number;
  nextInt(minInclusive: number, maxInclusive: number): number;
  nextRange(minInclusive: number, maxInclusive: number): number;
  fork(salt: number): Prng;
}

function mulberry32(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let mixed = Math.imul(state ^ (state >>> 15), 1 | state);
    mixed ^= mixed + Math.imul(mixed ^ (mixed >>> 7), 61 | mixed);
    return ((mixed ^ (mixed >>> 14)) >>> 0) / 4294967296;
  };
}

class MulberryPrng implements Prng {
  private readonly source: () => number;

  constructor(private readonly seed: number) {
    this.source = mulberry32(seed);
  }

  next(): number {
    return this.source();
  }

  nextInt(minInclusive: number, maxInclusive: number): number {
    return Math.floor(this.nextRange(minInclusive, maxInclusive + 1));
  }

  nextRange(minInclusive: number, maxInclusive: number): number {
    return minInclusive + (maxInclusive - minInclusive) * this.next();
  }

  fork(salt: number): Prng {
    return new MulberryPrng((this.seed ^ salt) >>> 0);
  }
}

export function createPrng(seed: number): Prng {
  return new MulberryPrng(seed);
}
