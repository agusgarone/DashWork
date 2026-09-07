import type {
  BacklogCategory,
  BacklogItem,
  BacklogSort,
  EstimatedTime,
} from "@/types";
import { compareEstimatedTime } from "@/utils/time";

export type TimeFilter = "All" | EstimatedTime;
export type CategoryFilter = "All" | BacklogCategory;

export function filterBacklog(
  items: BacklogItem[],
  query: string,
  time: TimeFilter,
  category: CategoryFilter,
): BacklogItem[] {
  const normalized = query.trim().toLowerCase();

  return items.filter((item) => {
    const matchesTime = time === "All" || item.estimatedTime === time;
    const matchesCategory = category === "All" || item.category === category;

    if (!matchesTime || !matchesCategory) return false;
    if (!normalized) return true;

    const haystack = [
      item.title,
      item.description ?? "",
      item.category,
      item.status,
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(normalized);
  });
}

export function sortBacklog(
  items: BacklogItem[],
  sort: BacklogSort,
): BacklogItem[] {
  const sorted = [...items];

  sorted.sort((a, b) => {
    switch (sort) {
      case "oldest":
        return a.createdAt.localeCompare(b.createdAt);
      case "shortest":
        return compareEstimatedTime(a.estimatedTime, b.estimatedTime);
      case "longest":
        return compareEstimatedTime(b.estimatedTime, a.estimatedTime);
      case "newest":
      default:
        return b.createdAt.localeCompare(a.createdAt);
    }
  });

  return sorted;
}
