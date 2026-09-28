import type { FieldKind } from "./types";

/** Pick a fake kind from a key-name heuristic. */
export function kindOf(key: string): FieldKind {
  const k = key.toLowerCase();

  const rules: Array<[RegExp, FieldKind]> = [
    [/pass(?:word)?|pwd|secret/, "password"],
    [/token|bearer|auth|api_?key|access_?(?:key|code)/, "token"],
    [/e-?mail/, "email"],
    [/phone|mobile|tel/, "phone"],
    [/name/, "name"],
    [/street|city|postal|zip|address/, "address"],
    [/ip(?:[^a-z]|$)/, "ip"],
    [/birth|dob/, "date"],
    [/(?:^|_)(?:id|uuid|guid|ref|reference|customer)/, "id"],
  ];

  for (const [pattern, kind] of rules) {
    if (pattern.test(k)) return kind;
  }
  return "text";
}
