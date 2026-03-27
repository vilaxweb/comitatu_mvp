import { describe, expect, it } from "vitest";
import {
  getPasswordPolicyMessage,
  isStrongPassword,
  sanitizeInternalPath,
} from "../../lib/auth/security";

describe("auth security smoke tests", () => {
  it("accepts only strong passwords", () => {
    expect(isStrongPassword("abc123")).toBe(false);
    expect(isStrongPassword("verysecurepass1")).toBe(false);
    expect(isStrongPassword("VerySecurePass1")).toBe(true);
  });

  it("sanitizes next param to internal paths", () => {
    expect(sanitizeInternalPath("/provider")).toBe("/provider");
    expect(sanitizeInternalPath("https://evil.test")).toBe("/");
    expect(sanitizeInternalPath("//evil.test")).toBe("/");
    expect(sanitizeInternalPath("javascript:alert(1)")).toBe("/");
  });

  it("exposes a clear password policy message", () => {
    expect(getPasswordPolicyMessage().toLowerCase()).toContain("al menos");
  });
});
