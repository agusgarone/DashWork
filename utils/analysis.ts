import {
  ANALYSIS_STATUSES,
  type AnalysisStatus,
  type IssueAnalysis,
} from "@/types";

export const ANALYSIS_SECTIONS = [
  {
    title: "Comprensión del problema",
    questions: [
      "¿Qué problema busca resolver la tarea?",
      "¿Cuál es el comportamiento actual?",
      "¿Qué funcionalidades deberían mantenerse?",
      "¿Qué está fuera del alcance?",
    ],
  },
  {
    title: "Investigación técnica",
    questions: [
      "¿Qué componentes, archivos o servicios intervienen?",
      "¿Cómo funciona actualmente el proceso?",
      "¿Qué dependencias existen?",
      "¿Qué descubrimientos técnicos son relevantes?",
    ],
  },
  {
    title: "Alternativas de solución",
    questions: [
      "¿Cuál es mi primera propuesta?",
      "¿Qué otras alternativas razonables existen?",
      "¿Qué ventajas y desventajas tiene cada una?",
      "¿Qué complejidad introduce cada alternativa?",
    ],
  },
  {
    title: "Riesgos y casos límite",
    questions: [
      "¿En qué escenarios podría fallar?",
      "¿Qué efectos secundarios podría producir?",
      "¿Qué casos límite debo contemplar?",
      "¿Qué funcionalidades existentes podrían verse afectadas?",
    ],
  },
  {
    title: "Validación",
    questions: [
      "¿Cómo voy a comprobar que funciona?",
      "¿Qué escenarios debería probar?",
      "¿Qué tests podrían automatizarse?",
      "¿Qué debería verificar QA?",
    ],
  },
  {
    title: "Decisión técnica",
    questions: [
      "¿Qué solución voy a implementar?",
      "¿Por qué la elegí?",
      "¿Qué pasos necesito realizar?",
      "¿Qué dudas o incertidumbres quedan para la planning?",
    ],
  },
  {
    title: "Retrospectiva",
    questions: [
      "¿Qué problemas aparecieron durante el desarrollo?",
      "¿Qué riesgos no había anticipado?",
      "¿Qué cambiaría de mi análisis inicial?",
      "¿Qué aprendizaje puedo reutilizar?",
    ],
  },
] as const;

export type AnalysisStatusFilter = "All" | AnalysisStatus;

export function createAnalysisTemplate(): string {
  return ANALYSIS_SECTIONS.map((section) => `# ${section.title}`).join("\n\n");
}

export function normalizeIssueNumber(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

export function normalizeTitle(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

export function issueNumberKey(value: string): string {
  return normalizeIssueNumber(value).toLowerCase();
}

export function hasDuplicateIssueNumber(
  items: IssueAnalysis[],
  issueNumber: string,
  exceptId?: string,
): boolean {
  const key = issueNumberKey(issueNumber);
  if (!key) return false;
  return items.some(
    (item) => item.id !== exceptId && issueNumberKey(item.issueNumber) === key,
  );
}

export function filterAnalyses(
  items: IssueAnalysis[],
  query: string,
  status: AnalysisStatusFilter,
): IssueAnalysis[] {
  const normalized = query.trim().toLowerCase();

  return items
    .filter((item) => {
      if (status !== "All" && item.status !== status) return false;
      if (!normalized) return true;
      const haystack = [item.issueNumber, item.title, item.body]
        .join(" ")
        .toLowerCase();
      return haystack.includes(normalized);
    })
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

function isAnalysisStatus(value: unknown): value is AnalysisStatus {
  return (
    typeof value === "string" &&
    (ANALYSIS_STATUSES as readonly string[]).includes(value)
  );
}

function isIssueAnalysis(value: unknown): value is IssueAnalysis {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.id === "string" &&
    typeof item.issueNumber === "string" &&
    typeof item.title === "string" &&
    typeof item.body === "string" &&
    typeof item.createdAt === "string" &&
    typeof item.updatedAt === "string" &&
    (item.jiraUrl === undefined || typeof item.jiraUrl === "string") &&
    isAnalysisStatus(item.status)
  );
}

export function parseAnalyses(value: unknown): IssueAnalysis[] | null {
  if (!Array.isArray(value)) return null;
  if (!value.every(isIssueAnalysis)) return null;
  return value;
}
