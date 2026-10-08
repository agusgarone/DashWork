export const LINK_ICON_NAMES = [
  "link",
  "globe",
  "layout-grid",
  "git-branch",
  "component",
  "ticket",
  "book-open",
  "terminal",
] as const;

export type LinkIconName = (typeof LINK_ICON_NAMES)[number];

export type QuickLink = {
  id: string;
  name: string;
  url: string;
  icon?: LinkIconName;
  order: number;
};

export const BACKLOG_CATEGORIES = [
  "Work",
  "Technical",
  "Learning",
  "Documentation",
  "Idea",
  "Question",
] as const;

export type BacklogCategory = (typeof BACKLOG_CATEGORIES)[number];

export const ESTIMATED_TIMES = [
  "10 min",
  "15 min",
  "30 min",
  "1 h",
  "1 h+",
] as const;

export type EstimatedTime = (typeof ESTIMATED_TIMES)[number];

export const AVAILABLE_TIMES = ["10 min", "15 min", "30 min", "1 h"] as const;

export type AvailableTime = (typeof AVAILABLE_TIMES)[number];

export const BACKLOG_STATUSES = ["Pending", "In progress", "Done"] as const;

export type BacklogStatus = (typeof BACKLOG_STATUSES)[number];

export const BACKLOG_SORTS = [
  "newest",
  "oldest",
  "shortest",
  "longest",
] as const;

export type BacklogSort = (typeof BACKLOG_SORTS)[number];

export type BacklogItem = {
  id: string;
  title: string;
  description?: string;
  category: BacklogCategory;
  estimatedTime: EstimatedTime;
  status: BacklogStatus;
  createdAt: string;
  updatedAt: string;
};

export type ThemePreference = "light" | "dark" | "system";

export const ANALYSIS_STATUSES = [
  "Borrador",
  "En análisis",
  "Listo para implementar",
  "Finalizado",
] as const;

export type AnalysisStatus = (typeof ANALYSIS_STATUSES)[number];

export type IssueAnalysis = {
  id: string;
  issueNumber: string;
  title: string;
  jiraUrl?: string;
  status: AnalysisStatus;
  body: string;
  createdAt: string;
  updatedAt: string;
};
