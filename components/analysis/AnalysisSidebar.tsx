"use client";

import { Button } from "@/components/ui/Button";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import type { AnalysisStatus } from "@/types";
import { ANALYSIS_SECTIONS } from "@/utils/analysis";
import { formatShortTimestamp } from "@/utils/date";

type AnalysisSidebarProps = {
  issueNumber: string;
  title: string;
  status: AnalysisStatus;
  jiraUrl?: string;
  updatedAt: string;
  onDelete: () => void;
};

function SummaryLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-xs text-muted">{label}</dt>
      <dd className="text-sm text-foreground">{value}</dd>
    </div>
  );
}

export function AnalysisSidebar({
  issueNumber,
  title,
  status,
  jiraUrl,
  updatedAt,
  onDelete,
}: AnalysisSidebarProps) {
  const { copied, copy } = useCopyToClipboard();
  const updated = formatShortTimestamp(updatedAt);
  const copyValue = [issueNumber, title].filter(Boolean).join(" — ");

  return (
    <aside className="flex min-w-0 flex-col gap-8 lg:sticky lg:top-8 lg:max-h-[calc(100vh-4rem)] lg:overflow-y-auto">
      <section className="flex flex-col gap-3">
        <h2 className="text-[11px] uppercase tracking-wide text-muted">
          Resumen del issue
        </h2>
        <dl className="flex flex-col gap-3">
          <SummaryLine label="Número" value={issueNumber || "Sin número"} />
          <SummaryLine label="Título" value={title || "Sin título"} />
          <SummaryLine label="Estado" value={status} />
          {jiraUrl ? (
            <div className="flex flex-col gap-0.5">
              <dt className="text-xs text-muted">Jira</dt>
              <dd className="truncate text-sm text-foreground">
                <a
                  href={jiraUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-border underline-offset-4 hover:decoration-foreground"
                >
                  {jiraUrl}
                </a>
              </dd>
            </div>
          ) : null}
          <SummaryLine label="Última edición" value={updated || "—"} />
        </dl>
      </section>

      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-[11px] uppercase tracking-wide text-muted">
            Guía de análisis
          </h2>
          <p className="mt-1 text-sm text-muted">
            Preguntas para orientar. No hace falta responderlas todas.
          </p>
        </div>
        {ANALYSIS_SECTIONS.map((section) => (
          <div key={section.title} className="flex flex-col gap-1.5">
            <h3 className="text-sm text-foreground">{section.title}</h3>
            <ul className="flex flex-col gap-1">
              {section.questions.map((question) => (
                <li key={question} className="text-sm text-muted">
                  {question}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-[11px] uppercase tracking-wide text-muted">
          Acciones rápidas
        </h2>
        <Button
          variant="secondary"
          className="justify-start"
          disabled={!copyValue}
          onClick={() => {
            void copy(copyValue);
          }}
        >
          {copied ? "Copiado" : "Copiar número y título"}
        </Button>
        {jiraUrl ? (
          <a
            href={jiraUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 items-center justify-start rounded-md border border-border bg-surface px-3 text-sm font-medium text-foreground outline-none transition-colors duration-150 hover:bg-hover focus-visible:ring-2 focus-visible:ring-foreground/20"
          >
            Abrir Jira
          </a>
        ) : null}
        <Button variant="danger" className="justify-start" onClick={onDelete}>
          Eliminar análisis
        </Button>
      </section>
    </aside>
  );
}
