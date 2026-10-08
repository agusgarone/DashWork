import { describe, expect, it } from "vitest";
import type { IssueAnalysis } from "@/types";
import {
  createAnalysisTemplate,
  filterAnalyses,
  hasDuplicateIssueNumber,
  normalizeIssueNumber,
  parseAnalyses,
} from "./analysis";

function item(
  overrides: Partial<IssueAnalysis> & Pick<IssueAnalysis, "id" | "issueNumber">,
): IssueAnalysis {
  return {
    title: "Tarea",
    status: "Borrador",
    body: "",
    createdAt: "2026-10-08T12:00:00.000Z",
    updatedAt: "2026-10-08T12:00:00.000Z",
    ...overrides,
  };
}

describe("createAnalysisTemplate", () => {
  it("includes the seven section headings", () => {
    const template = createAnalysisTemplate();
    expect(template).toContain("# Comprensión del problema");
    expect(template).toContain("# Investigación técnica");
    expect(template).toContain("# Alternativas de solución");
    expect(template).toContain("# Riesgos y casos límite");
    expect(template).toContain("# Validación");
    expect(template).toContain("# Decisión técnica");
    expect(template).toContain("# Retrospectiva");
  });
});

describe("normalizeIssueNumber", () => {
  it("trims and collapses whitespace", () => {
    expect(normalizeIssueNumber("  973  ")).toBe("973");
    expect(normalizeIssueNumber(" AB   821 ")).toBe("AB 821");
  });
});

describe("hasDuplicateIssueNumber", () => {
  const items = [item({ id: "1", issueNumber: "AB-821" })];

  it("matches the same number regardless of case", () => {
    expect(hasDuplicateIssueNumber(items, "ab-821")).toBe(true);
  });

  it("ignores the analysis being edited", () => {
    expect(hasDuplicateIssueNumber(items, "AB-821", "1")).toBe(false);
  });

  it("allows a different number", () => {
    expect(hasDuplicateIssueNumber(items, "973")).toBe(false);
  });
});

describe("filterAnalyses", () => {
  const items = [
    item({
      id: "1",
      issueNumber: "973",
      title: "Carrusel",
      body: "banners",
      status: "En análisis",
      updatedAt: "2026-10-08T10:00:00.000Z",
    }),
    item({
      id: "2",
      issueNumber: "120",
      title: "Login",
      body: "auth",
      status: "Borrador",
      updatedAt: "2026-10-08T12:00:00.000Z",
    }),
  ];

  it("searches number, title, and body", () => {
    expect(filterAnalyses(items, "banner", "All").map((entry) => entry.id)).toEqual([
      "1",
    ]);
  });

  it("filters by status and sorts by last update", () => {
    expect(filterAnalyses(items, "", "All").map((entry) => entry.id)).toEqual([
      "2",
      "1",
    ]);
    expect(filterAnalyses(items, "", "Borrador").map((entry) => entry.id)).toEqual([
      "2",
    ]);
  });
});

describe("parseAnalyses", () => {
  it("accepts a valid list", () => {
    const items = [item({ id: "1", issueNumber: "973" })];
    expect(parseAnalyses(items)).toEqual(items);
  });

  it("rejects invalid payloads", () => {
    expect(parseAnalyses({ id: "1" })).toBeNull();
    expect(parseAnalyses([{ id: "1" }])).toBeNull();
  });
});
