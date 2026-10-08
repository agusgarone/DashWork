import type { Metadata } from "next";
import { AnalysisEditor } from "@/components/analysis/AnalysisEditor";

export const metadata: Metadata = {
  title: "Análisis de issues",
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <AnalysisEditor id={id} />;
}
