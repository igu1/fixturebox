/**
 * Deterministic fake-value factory: the same original value always maps to
 * the same fake inside one fixture run (so relationships survive).
 */
export class Store {
  private counters = new Map<string, number>();
  private mapping = new Map<string, unknown>();

  /** value-keyed, id-like counters advance only for genuinely new values */
  nextNumber(kind: string, cacheKey: string): number {
    const mapped = this.mapping.get(cacheKey);
    if (mapped !== undefined) return mapped as number;
    const n = (this.counters.get(kind) ?? 0) + 1;
    this.counters.set(kind, n);
    this.mapping.set(cacheKey, n);
    return n;
  }
}

const FIRST_NAMES = ["Alex", "Priya", "Sam", "Noor", "Kenji", "Amina", "Dev", "Lena", "Omar", "Zoe"];
const LAST_NAMES = ["Stone", "Kapoor", "River", "Hassan", "Watanabe", "Okafor", "Patel", "Moreau", "Silva", "Chen"];
const CITIES = ["Springville", "Fairtown", "Ashford", "Millbrook", "Lakeside", "Mapleville"];

const pick = <T>(items: T[], i: number): T => items[i % items.length];

export function fakeName(n: number): string {
  return `${pick(FIRST_NAMES, n)} ${pick(LAST_NAMES, n * 3 + 1)}`;
}

export function fakeEmail(n: number): string {
  return `${pick(FIRST_NAMES, n).toLowerCase()}.${pick(LAST_NAMES, n + 2).toLowerCase()}${n}@example.test`;
}

export function fakePhone(n: number): string {
  return `+1-555-0${String(100 + n)}`;
}

export function fakeToken(n: number): string {
  return `tok_test_${String(n).padStart(4, "0")}`;
}

export function fakePassword(n: number): string {
  return `password****${String(n).padStart(2, "0")}`;
}

export function fakeAddress(n: number): string {
  return `${100 + n} Fixture Ave, ${pick(CITIES, n)}`;
}

export function fakeIp(n: number): string {
  return `10.0.${n % 255}.${(n * 7) % 254 + 1}`;
}

export function fakeDate(): string {
  return "2026-01-15T00:00:00.000Z";
}
