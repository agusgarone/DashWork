import type { EstimatedTime } from "@/types";

export const TIME_IN_MINUTES: Record<EstimatedTime, number> = {
  "10 min": 10,
  "15 min": 15,
  "30 min": 30,
  "1 h": 60,
  "1 h+": 90,
};

export function compareEstimatedTime(
  a: EstimatedTime,
  b: EstimatedTime,
): number {
  return TIME_IN_MINUTES[a] - TIME_IN_MINUTES[b];
}
