"use client";

import { useState } from "react";
import {
  BacklogSection,
  type BacklogPanelState,
} from "@/components/backlog/BacklogSection";
import { WhatCanIWorkOn } from "@/components/backlog/WhatCanIWorkOn";
import { BranchGeneratorSection } from "@/components/branch-generator/BranchGeneratorSection";
import { Header } from "@/components/header/Header";
import { QuickAccessSection } from "@/components/quick-access/QuickAccessSection";
import { useBacklog } from "@/hooks/useBacklog";

export function Dashboard() {
  const backlog = useBacklog();
  const [panel, setPanel] = useState<BacklogPanelState>({ mode: "closed" });

  return (
    <div className="mx-auto w-full max-w-[1120px] px-5 pb-16 pt-8 sm:px-8 sm:pt-10">
      <Header />
      <div className="mt-10 flex flex-col divide-y divide-border sm:mt-12">
        <div className="pb-12">
          <QuickAccessSection />
        </div>
        <div className="py-12">
          <BranchGeneratorSection />
        </div>
        <div className="py-12">
          <WhatCanIWorkOn
            items={backlog.items}
            onSelect={(id) => setPanel({ mode: "edit", id })}
          />
        </div>
        <div className="pt-12">
          <BacklogSection
            items={backlog.items}
            visibleItems={backlog.visibleItems}
            query={backlog.query}
            onQueryChange={backlog.setQuery}
            timeFilter={backlog.timeFilter}
            onTimeFilterChange={backlog.setTimeFilter}
            categoryFilter={backlog.categoryFilter}
            onCategoryFilterChange={backlog.setCategoryFilter}
            sort={backlog.sort}
            onSortChange={backlog.setSort}
            onAdd={backlog.addItem}
            onUpdate={backlog.updateItem}
            onDelete={backlog.deleteItem}
            panel={panel}
            onPanelChange={setPanel}
          />
        </div>
      </div>
    </div>
  );
}
