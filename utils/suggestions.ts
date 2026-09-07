import type { AvailableTime, BacklogItem } from "@/types";
import { TIME_IN_MINUTES } from "@/utils/time";

const SUGGESTION_LIMIT = 3;

export function getEligibleItems(
  items: BacklogItem[],
  available: AvailableTime,
): BacklogItem[] {
  const limit = TIME_IN_MINUTES[available];

  return items
    .filter(
      (item) =>
        item.status !== "Done" && TIME_IN_MINUTES[item.estimatedTime] <= limit,
    )
    .sort((a, b) => {
      const timeDiff =
        TIME_IN_MINUTES[b.estimatedTime] - TIME_IN_MINUTES[a.estimatedTime];
      if (timeDiff !== 0) return timeDiff;
      return b.createdAt.localeCompare(a.createdAt);
    });
}

export function pickSuggestions(
  items: BacklogItem[],
  available: AvailableTime,
  excludeIds: string[] = [],
  limit = SUGGESTION_LIMIT,
): BacklogItem[] {
  const eligible = getEligibleItems(items, available);
  if (eligible.length === 0) return [];

  if (excludeIds.length === 0) {
    return eligible.slice(0, limit);
  }

  if (eligible.length <= limit) {
    const offset = eligible.findIndex((item) => item.id === excludeIds[0]);
    const start = offset >= 0 ? (offset + 1) % eligible.length : 1;
    return [...eligible.slice(start), ...eligible.slice(0, start)];
  }

  const remaining = eligible.filter((item) => !excludeIds.includes(item.id));
  const current = eligible.filter((item) => excludeIds.includes(item.id));

  return [...remaining, ...current].slice(0, limit);
}
