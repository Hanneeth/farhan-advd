/** Seeded PRNG (mulberry32) so a generated problem can be reproduced from its seed. */
export type Rng = () => number;

export function makeRng(seed: number): Rng {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Pick one of a list. */
export function pick<T>(rng: Rng, xs: readonly T[]): T {
  return xs[Math.floor(rng() * xs.length)];
}

/** A "nice" value on a grid between lo and hi (inclusive), e.g. step 0.05 V. */
export function nice(rng: Rng, lo: number, hi: number, step: number): number {
  const n = Math.floor((hi - lo) / step + 1e-9);
  const k = Math.floor(rng() * (n + 1));
  return Math.round((lo + k * step) / step) * step;
}

export function newSeed(): number {
  return Math.floor(Math.random() * 2 ** 31);
}
