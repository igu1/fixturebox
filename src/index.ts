import type { FieldKind, FixtureOptions } from "./types";
import { kindOf } from "./kinds";
import {
  fakeAddress,
  fakeDate,
  fakeEmail,
  fakeIp,
  fakeName,
  fakePassword,
  fakePhone,
  fakeToken,
  Store,
} from "./generators";

/**
 * Build a development-safe fixture from any JSON-style data:
 *
 * ```ts
 * fixture(realApiResponse);   // { name: "Alex Stone", email: "…@example.test" }
 * ```
 *
 * - same original value → same fake inside one call (relationships kept)
 * - structure, types, nullability and array length preserved
 * - replacement kinds come from key-name heuristic or `options.fields`
 */
export function fixture<T>(value: T, options: FixtureOptions = {}): unknown {
  const store = new Store();
  const cache = new Map<string, unknown>();
  const overrides = options.fields ?? {};

  const byKind = (
    kind: FieldKind,
    cacheKey: string,
    key: string,
    isNumber: boolean,
    original: string | number,
  ): unknown => {
    const n = store.nextNumber(kind, cacheKey);
    switch (kind) {
      case "name": return fakeName(n);
      case "email": return fakeEmail(n);
      case "phone": return fakePhone(n);
      case "token": return fakeToken(n);
      case "password": return fakePassword(n);
      case "address": return fakeAddress(n);
      case "ip": return fakeIp(n);
      case "date": return fakeDate();
      case "id":
        return isNumber
          ? n
          : `${key.replace(/_?id$/i, "") || key}_fake_${String(n).padStart(3, "0")}`;
      default:
        // "text": leave the value alone — most fields are harmless
        return original;
    }
  };

  const cacheKeyOf = (kind: FieldKind, value: unknown): string =>
    `${kind}#${typeof value === "object" ? JSON.stringify(value) : String(value)}`;

  const replace = (path: string, key: string, value: string | number): unknown => {
    const kind = overrides[key] ?? kindOf(key);
    if (kind === "text") return value;
    const cacheKey = cacheKeyOf(kind, value);
    if (cache.has(cacheKey)) return cache.get(cacheKey);
    const fakeValue = byKind(kind, cacheKey, key, typeof value === "number", value);
    cache.set(cacheKey, fakeValue);
    return fakeValue;
  };

  const visit = (node: unknown, path: string, parentKey: string): unknown => {
    if (Array.isArray(node)) {
      return node.map((item, i) => visit(item, `${path}[${i}]`, parentKey));
    }
    if (node !== null && typeof node === "object") {
      const out: Record<string, unknown> = {};
      for (const [key, v] of Object.entries(node as Record<string, unknown>)) {
        out[key] = visit(v, path ? `${path}.${key}` : key, key);
      }
      return out;
    }
    if (typeof node === "string" || typeof node === "number") {
      return replace(path, parentKey, node);
    }
    return node;
  };

  return visit(value, "", "");
}

/** Generate a fake value by kind without a source object. */
export function fake(kind: FieldKind, n: number): string {
  switch (kind) {
    case "name": return fakeName(n);
    case "email": return fakeEmail(n);
    case "phone": return fakePhone(n);
    case "token": return fakeToken(n);
    case "password": return fakePassword(n);
    case "address": return fakeAddress(n);
    case "ip": return fakeIp(n);
    case "date": return fakeDate();
    default: return `fixture-value-${n}`;
  }
}
