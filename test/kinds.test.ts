import { describe, expect, it } from "vitest";
import { fixture, fake } from "../src/index";
import { kindOf } from "../src/kinds";

describe("kindOf heuristics", () => {
  it("assigns sensible kinds from key names", () => {
    expect(kindOf("email")).toBe("email");
    expect(kindOf("phone")).toBe("phone");
    expect(kindOf("user_name")).toBe("name");
    expect(kindOf("password_hash")).toBe("password");
    expect(kindOf("auth_token")).toBe("token");
    expect(kindOf("city")).toBe("address");
    expect(kindOf("customer_id")).toBe("id");
    expect(kindOf("ip")).toBe("ip");
    expect(kindOf("unknown_thing")).toBe("text");
  });
});
