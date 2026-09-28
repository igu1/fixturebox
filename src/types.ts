export type FieldKind =
  | "name"
  | "email"
  | "phone"
  | "id"
  | "token"
  | "password"
  | "address"
  | "date"
  | "ip"
  | "text";

export interface FixtureOptions {
  /** explicit per-field override: key -> fake kind */
  fields?: Record<string, FieldKind>;
}
