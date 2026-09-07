export function formatHeaderDate(date: Date = new Date()): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

export function nowIso(): string {
  return new Date().toISOString();
}
