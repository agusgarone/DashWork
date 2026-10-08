"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import type {
  AnalysisDraft,
  AnalysisWriteReason,
  AnalysisWriteResult,
} from "@/hooks/useAnalyses";

type AnalysisFormDialogProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (draft: AnalysisDraft) => AnalysisWriteResult;
};

const WRITE_ERRORS: Record<AnalysisWriteReason, string> = {
  empty: "El número y el título son obligatorios.",
  duplicate: "Ya existe un análisis con ese número de issue.",
  persist: "No se pudo guardar. El almacenamiento del navegador está lleno.",
  corrupted:
    "No se pudieron leer los análisis guardados, así que no se va a escribir encima.",
};

export function AnalysisFormDialog({
  open,
  onClose,
  onSubmit,
}: AnalysisFormDialogProps) {
  const [issueNumber, setIssueNumber] = useState("");
  const [title, setTitle] = useState("");
  const [jiraUrl, setJiraUrl] = useState("");
  const [error, setError] = useState("");

  const submit = () => {
    const result = onSubmit({
      issueNumber,
      title,
      jiraUrl,
    });
    if (!result.ok) {
      setError(WRITE_ERRORS[result.reason] ?? "No se pudo crear el análisis.");
      return;
    }
    onClose();
  };

  return (
    <Modal open={open} title="Nuevo análisis" onClose={onClose}>
      <form
        className="flex flex-col gap-3"
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        <Field label="Número de issue" htmlFor="analysis-number">
          <Input
            id="analysis-number"
            value={issueNumber}
            placeholder="973"
            className="font-mono"
            onChange={(event) => setIssueNumber(event.target.value)}
          />
        </Field>
        <Field label="Título" htmlFor="analysis-title">
          <Input
            id="analysis-title"
            value={title}
            placeholder="Rediseño de carrusel de banners"
            onChange={(event) => setTitle(event.target.value)}
          />
        </Field>
        <Field label="URL de Jira" htmlFor="analysis-jira">
          <Input
            id="analysis-jira"
            value={jiraUrl}
            placeholder="Opcional"
            onChange={(event) => setJiraUrl(event.target.value)}
          />
        </Field>
        {error ? <p className="text-sm text-foreground">{error}</p> : null}
        <div className="mt-2 flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary">
            Crear
          </Button>
        </div>
      </form>
    </Modal>
  );
}
