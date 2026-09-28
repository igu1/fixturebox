import { describe, expect, it } from "vitest";
import { fixture, fake } from "../src/index";

describe("fixture()", () => {
  const input = {
    name: "Mohammed Ali",
    email: "ali@example.com",
    phone: "+919876543210",
    customer_id: "cus_829123",
    active: true,
    notes: "First signup on the new landing page",
    tags: ["vip", "beta"],
  };

  it("replaces PII while keeping structure and types", () => {
    const out = fixture(input) as typeof input;
    expect(out).toMatchObject({
      active: true,
    });
    expect(out.email).toMatch(/@example\.test$/);
    expect(out.email).not.toContain("ali");
    expect(out.phone).not.toBe("+919876543210");
    expect(String(out.customer_id)).not.toContain("829123");
    expect(out.name).not.toBe("Mohammed Ali");
  });

  it("tags array keeps its length and values (kind=text)", () => {
    const out = fixture(input) as typeof input;
    expect(out.tags).toHaveLength(2);
    expect(out.tags[0]).toBe("vip");
  });

  it("notes text kind value stays", () => {
    const out = fixture(input) as typeof input;
    expect(out.notes).toBe("First signup on the new landing page");
  });

  it("same original value maps to the same fake (relationships)", () => {
    const nested = {
      user_id: 91,
      orders: [{ user_id: 91 }, { user_id: 92 }],
    };
    const out = fixture(nested) as typeof nested;
    expect(out.orders[0].user_id).toBe(out.user_id);
    expect(out.orders[1].user_id).not.toBe(out.user_id);
  });

  it("array length and null preserved", () => {
    const src = { items: [1, 2, 3], maybe: null };
    const out = fixture(src) as typeof src;
    expect(out.items).toHaveLength(3);
    expect(out.maybe).toBeNull();
  });

  it("explicit fields override the heuristic", () => {
    const out = fixture(
      { id: "abc123", name: "Real Person" },
      { fields: { name: "email", id: "token" } },
    ) as Record<string, unknown>;
    expect(String(out.name)).toMatch(/@example\.test$/);
    expect(String(out.id)).toMatch(/^tok_test_/);
  });

  it("multiple objects share the deterministic mapping inside one call", () => {
    const a = fixture({ user: { email: "same@example.com" }, again: { email: "same@example.com" } }) as {
      user: { email: string };
      again: { email: string };
    };
    expect(a.user.email).toBe(a.again.email);
  });
});

describe("fake()", () => {
  it("provides direct fake generators", () => {
    expect(fake("email", 1)).toMatch(/@example\.test$/);
    expect(fake("phone", 1)).toMatch(/^\+1-555-/);
    expect(fake("token", 3)).toBe("tok_test_0003");
  });
});
