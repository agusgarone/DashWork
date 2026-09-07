"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import {
  AVAILABLE_TIMES,
  type AvailableTime,
  type BacklogItem,
} from "@/types";
import { pickSuggestions } from "@/utils/suggestions";

type WhatCanIWorkOnProps = {
  items: BacklogItem[];
  onSelect: (id: string) => void;
};

export function WhatCanIWorkOn({ items, onSelect }: WhatCanIWorkOnProps) {
  const [available, setAvailable] = useState<AvailableTime>("30 min");
  const [excludeIds, setExcludeIds] = useState<string[]>([]);

  const suggestions = pickSuggestions(items, available, excludeIds);

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-[15px] font-medium tracking-tight text-foreground">
            What can I work on?
          </h2>
          <label className="mt-2 inline-flex items-center gap-2 whitespace-nowrap text-sm text-muted">
            I have
            <span className="inline-block w-[110px] shrink-0">
              <Select
                aria-label="Available time"
                value={available}
                onChange={(event) => {
                  setAvailable(event.target.value as AvailableTime);
                  setExcludeIds([]);
                }}
              >
                {AVAILABLE_TIMES.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </Select>
            </span>
          </label>
        </div>
        {suggestions.length > 0 ? (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setExcludeIds(suggestions.map((item) => item.id))}
          >
            Pick another
          </Button>
        ) : null}
      </div>
      {suggestions.length === 0 ? (
        <p className="text-sm text-muted">
          Nothing fits this time. Add a shorter task to the backlog.
        </p>
      ) : (
        <ul className="flex flex-col">
          {suggestions.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => onSelect(item.id)}
                className="flex w-full items-baseline justify-between gap-3 rounded-md px-2 py-2 text-left transition-colors duration-150 hover:bg-hover"
              >
                <span className="truncate text-sm text-foreground">
                  {item.title}
                </span>
                <span className="shrink-0 text-xs text-muted">
                  {item.estimatedTime}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
