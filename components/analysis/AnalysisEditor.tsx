"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnalysisSidebar } from "@/components/analysis/AnalysisSidebar";
import { AppFrame } from "@/components/AppFrame";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import {
  useAnalyses,
  type AnalysisUpdate,
  type AnalysisWriteReason,
} from "@/hooks/useAnalyses";
import { ANALYSIS_STATUSES, type AnalysisStatus, type IssueAnalysis } from "@/types";
import { normalizeUrl } from "@/utils/url";

const SAVE_DELAY_MS = 600;

type EditorDraft = {
  issueNumber: string;
  title: string;
  jiraUrl: string;
  status: AnalysisStatus;
  body: string;
};

type SaveState =
  | { status: "saved" }
  | { status: "saving" }
  | { status: "error"; reason: AnalysisWriteReason };

function useMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

function draftFromItem(item: IssueAnalysis): EditorDraft {
  return {
    issueNumber: item.issueNumber,
    title: item.title,
    jiraUrl: item.jiraUrl ?? "",
    status: item.status,
    body: item.body,
  };
}

function draftKey(draft: EditorDraft): string {
  return JSON.stringify(draft);
}

function toUpdate(draft: EditorDraft): AnalysisUpdate {
  return {
    issueNumber: draft.issueNumber,
    title: draft.title,
    jiraUrl: draft.jiraUrl,
    status: draft.status,
    body: draft.body,
  };
}

function saveLabel(state: SaveState): string {
  if (state.status === "saving") return "Guardando...";
  if (state.status === "saved") return "Guardado";
  if (state.reason === "empty") return "El número y el título son obligatorios";
  if (state.reason === "duplicate") return "Ese número de issue ya existe";
  if (state.reason === "corrupted") return "No se pudo leer el almacenamiento";
  return "No se pudo guardar";
}

function AnalysisDocument({ item }: { item: IssueAnalysis }) {
  const router = useRouter();
  const { updateAnalysis, deleteAnalysis } = useAnalyses();
  const [draft, setDraft] = useState<EditorDraft>(() => draftFromItem(item));
  const [saveState, setSaveState] = useState<SaveState>({ status: "saved" });
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const savedKey = useRef(draftKey(draft));
  const draftRef = useRef(draft);
  const itemRef = useRef(item);
  const updateRef = useRef(updateAnalysis);

  useEffect(() => {
    draftRef.current = draft;
    itemRef.current = item;
    updateRef.current = updateAnalysis;
  });

  const persist = useCallback((next: EditorDraft) => {
    const result = updateRef.current(item.id, toUpdate(next));
    if (result.ok) return result;

    if (result.reason === "empty" || result.reason === "duplicate") {
      const saved = itemRef.current;
      updateRef.current(item.id, {
        ...toUpdate(next),
        issueNumber: saved.issueNumber,
        title: saved.title,
      });
    }

    return result;
  }, [item.id]);

  useEffect(() => {
    const key = draftKey(draft);
    if (key === savedKey.current) return;

    const timeout = window.setTimeout(() => {
      const result = persist(draft);
      if (result.ok) savedKey.current = key;
      setSaveState(
        result.ok ? { status: "saved" } : { status: "error", reason: result.reason },
      );
    }, SAVE_DELAY_MS);

    setSaveState({ status: "saving" });

    return () => window.clearTimeout(timeout);
  }, [draft, persist]);

  useEffect(() => {
    return () => {
      const current = draftRef.current;
      const key = draftKey(current);
      if (key === savedKey.current) return;
      const result = persist(current);
      if (result.ok) savedKey.current = key;
    };
  }, [persist]);

  const remove = () => {
    const result = deleteAnalysis(item.id);
    if (!result.ok) {
      setDeleteError("No se pudo eliminar el análisis.");
      return;
    }
    savedKey.current = draftKey(draftRef.current);
    router.push("/analyses");
  };

  return (
    <AppFrame>
      <div className="mt-8 grid grid-cols-1 items-start gap-10 lg:mt-10 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-12">
        <div className="flex min-w-0 flex-col gap-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <Link
                href="/analyses"
                className="inline-flex items-center gap-1.5 rounded-md text-sm text-muted outline-none transition-colors duration-150 hover:text-foreground focus-visible:ring-2 focus-visible:ring-foreground/20"
              >
                <ArrowLeft size={14} strokeWidth={1.75} />
                Volver
              </Link>
              <p className="mt-4 font-mono text-xs text-muted">
                {draft.issueNumber || "Sin número"}
              </p>
              <h1 className="truncate text-lg font-medium tracking-tight text-foreground">
                {draft.title || "Sin título"}
              </h1>
              <p className="mt-0.5 text-sm text-muted">{draft.status}</p>
            </div>
            <p aria-live="polite" className="shrink-0 pt-1 text-xs text-muted">
              {saveLabel(saveState)}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Número de issue" htmlFor="edit-issue-number">
              <Input
                id="edit-issue-number"
                value={draft.issueNumber}
                className="font-mono"
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    issueNumber: event.target.value,
                  }))
                }
              />
            </Field>
            <Field label="Estado" htmlFor="edit-issue-status">
              <Select
                id="edit-issue-status"
                value={draft.status}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    status: event.target.value as AnalysisStatus,
                  }))
                }
              >
                {ANALYSIS_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </Select>
            </Field>
          </div>
          <Field label="Título" htmlFor="edit-issue-title">
            <Input
              id="edit-issue-title"
              value={draft.title}
              onChange={(event) =>
                setDraft((current) => ({ ...current, title: event.target.value }))
              }
            />
          </Field>
          <Field label="URL de Jira" htmlFor="edit-issue-jira">
            <Input
              id="edit-issue-jira"
              value={draft.jiraUrl}
              placeholder="Opcional"
              onChange={(event) =>
                setDraft((current) => ({ ...current, jiraUrl: event.target.value }))
              }
            />
          </Field>
          <Field label="Documento" htmlFor="edit-issue-body">
            <Textarea
              id="edit-issue-body"
              value={draft.body}
              className="min-h-[70vh] leading-6"
              onChange={(event) =>
                setDraft((current) => ({ ...current, body: event.target.value }))
              }
            />
          </Field>
        </div>

        <AnalysisSidebar
          issueNumber={draft.issueNumber}
          title={draft.title}
          status={draft.status}
          jiraUrl={
            draft.jiraUrl.trim() ? normalizeUrl(draft.jiraUrl) : undefined
          }
          updatedAt={item.updatedAt}
          onDelete={() => {
            setDeleteError("");
            setConfirmingDelete(true);
          }}
        />
      </div>

      {confirmingDelete ? (
        <Modal
          open
          title="Eliminar análisis"
          onClose={() => setConfirmingDelete(false)}
        >
          <p className="text-sm text-muted">
            Se va a eliminar el análisis {draft.issueNumber || item.issueNumber}.
            Esta acción no se puede deshacer.
          </p>
          {deleteError ? (
            <p className="mt-3 text-sm text-foreground">{deleteError}</p>
          ) : null}
          <div className="mt-5 flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setConfirmingDelete(false)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={remove}>
              Eliminar
            </Button>
          </div>
        </Modal>
      ) : null}
    </AppFrame>
  );
}

export function AnalysisEditor({ id }: { id: string }) {
  const mounted = useMounted();
  const { items, corrupted } = useAnalyses();
  const item = items.find((entry) => entry.id === id);

  if (!mounted) {
    return (
      <AppFrame>
        <p className="mt-10 text-sm text-muted">Cargando...</p>
      </AppFrame>
    );
  }

  if (corrupted) {
    return (
      <AppFrame>
        <p className="mt-10 text-sm text-foreground">
          No se pudieron leer los análisis guardados. No se va a sobrescribir
          lo que haya en este navegador.
        </p>
      </AppFrame>
    );
  }

  if (!item) {
    return (
      <AppFrame>
        <div className="mt-10 flex flex-col gap-3">
          <p className="text-sm text-muted">No encontramos ese análisis.</p>
          <Link
            href="/analyses"
            className="inline-flex w-fit items-center gap-1.5 text-sm text-foreground"
          >
            <ArrowLeft size={14} strokeWidth={1.75} />
            Volver al listado
          </Link>
        </div>
      </AppFrame>
    );
  }

  return <AnalysisDocument key={item.id} item={item} />;
}
