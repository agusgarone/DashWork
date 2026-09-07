import { describe, expect, it } from "vitest";
import {
  generateBranchName,
  sanitizeBranchDescription,
  sanitizeTicketId,
  stripDiacritics,
} from "./branch";

describe("stripDiacritics", () => {
  it("removes accents", () => {
    expect(stripDiacritics("Biómetrico")).toBe("Biometrico");
  });
});

describe("sanitizeBranchDescription", () => {
  it("lowercases, strips accents, and uses hyphens", () => {
    expect(sanitizeBranchDescription("Login Biométrico")).toBe(
      "login-biometrico",
    );
  });

  it("trims spaces and drops special characters", () => {
    expect(sanitizeBranchDescription("  Fix   Payment!! Error ")).toBe(
      "fix-payment-error",
    );
  });

  it("avoids consecutive hyphens", () => {
    expect(sanitizeBranchDescription("payment -- receipt")).toBe(
      "payment-receipt",
    );
  });

  it("returns an empty string when nothing remains", () => {
    expect(sanitizeBranchDescription("   !!!   ")).toBe("");
  });
});

describe("sanitizeTicketId", () => {
  it("uppercases and keeps the jira id", () => {
    expect(sanitizeTicketId("ab-821")).toBe("AB-821");
  });

  it("trims spaces and drops special characters", () => {
    expect(sanitizeTicketId("  ab 821 !! ")).toBe("AB-821");
  });
});

describe("generateBranchName", () => {
  it("builds testing-{issue}-AG", () => {
    expect(generateBranchName("AB-821")).toBe("testing-AB-821-AG");
  });

  it("uppercases a lowercase ticket id", () => {
    expect(generateBranchName("ab-821")).toBe("testing-AB-821-AG");
  });

  it("returns empty when the ticket is blank", () => {
    expect(generateBranchName("   ")).toBe("");
  });
});
