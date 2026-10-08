import type { Metadata } from "next";
import { AnalysesPage } from "@/components/analysis/AnalysesPage";

export const metadata: Metadata = {
  title: "Análisis de issues",
};

export default function Page() {
  return <AnalysesPage />;
}
