"use client";

import { useState, useSyncExternalStore } from "react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { AnalysisFormDialog } from "@/components/analysis/AnalysisFormDialog";
import { AnalysisRow } from "@/components/analysis/AnalysisRow";
import { AppFrame } from "@/components/AppFrame";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Section } from "@/components/ui/Section";
import { Select } from "@/components/ui/Select";
import { useAnalyses, type AnalysisDraft } from "@/hooks/useAnalyses";
import { ANALYSIS_STATUSES } from "@/types";

function useMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export function AnalysesPage() {
  const router = useRouter();
  const mounted = useMounted();
  const {
    items,
    corrupted,
    visibleItems,
    query,
    setQuery,
    statusFilter,
    setStatusFilter,
    addAnalysis,
  } = useAnalyses();
  const [dialogOpen, setDialogOpen] = useState(false);

  const createAnalysis = (draft: AnalysisDraft) => {
    const result = addAnalysis(draft);
    if (result.ok && result.id) router.push(`/analyses/${result.id}`);
    return result;
  };

  return (
    <AppFrame>
      <div className="mt-10">
        <Section
          title="Análisis de issues"
          description="Un documento por issue para investigar antes de implementar."
          action={
            <Button
              size="sm"
              onClick={() => setDialogOpen(true)}
              disabled={corrupted}
            >
              <Plus size={14} strokeWidth={1.75} />
              Nuevo análisis
            </Button>
          }
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Input
              value={query}
              placeholder="Buscar por número, título o contenido"
              aria-label="Buscar análisis"
              onChange={(event) => setQuery(event.target.value)}
            />
            <Select
              aria-label="Filtrar por estado"
              value={statusFilter}
              className="sm:w-64"
              onChange={(event) =>
                setStatusFilter(
                  event.target.value as typeof statusFilter,
                )
              }
            >
              <option value="All">Todos</option>
              {ANALYSIS_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </Select>
          </div>
          {corrupted ? (
            <p className="px-2 py-6 text-sm text-foreground">
              No se pudieron leer los análisis guardados. No se va a
              sobrescribir lo que haya en este navegador.
            </p>
          ) : !mounted ? (
            <p className="px-2 py-6 text-sm text-muted">Cargando...</p>
          ) : visibleItems.length === 0 ? (
            <p className="px-2 py-6 text-sm text-muted">
              {items.length === 0
                ? "Todavía no hay análisis."
                : "Ningún análisis coincide con la búsqueda."}
            </p>
          ) : (
            <div className="flex flex-col">
              {visibleItems.map((item) => (
                <AnalysisRow key={item.id} item={item} />
              ))}
            </div>
          )}
        </Section>
      </div>
      {dialogOpen ? (
        <AnalysisFormDialog
          open
          onClose={() => setDialogOpen(false)}
          onSubmit={createAnalysis}
        />
      ) : null}
    </AppFrame>
  );
}
