import type { BacklogItem, QuickLink } from "@/types";

export const defaultLinks: QuickLink[] = [
  {
    id: "seed-link-jira",
    name: "Jira",
    url: "https://jira.atlassian.com",
    icon: "ticket",
    order: 0,
  },
  {
    id: "seed-link-gitlab",
    name: "GitLab",
    url: "https://gitlab.com",
    icon: "git-branch",
    order: 1,
  },
  {
    id: "seed-link-figma",
    name: "Figma",
    url: "https://figma.com",
    icon: "component",
    order: 2,
  },
];

const seedNow = Date.UTC(2026, 8, 7, 12, 0, 0);

export const defaultBacklog: BacklogItem[] = [
  {
    id: "seed-backlog-android-nav",
    title: "Investigate Android navigation issue",
    category: "Technical",
    estimatedTime: "15 min",
    status: "Pending",
    createdAt: new Date(seedNow).toISOString(),
    updatedAt: new Date(seedNow).toISOString(),
  },
  {
    id: "seed-backlog-auth",
    title: "Review authentication flow",
    category: "Work",
    estimatedTime: "30 min",
    status: "Pending",
    createdAt: new Date(seedNow - 60_000).toISOString(),
    updatedAt: new Date(seedNow - 60_000).toISOString(),
  },
  {
    id: "seed-backlog-deploy",
    title: "Document deployment process",
    category: "Documentation",
    estimatedTime: "1 h",
    status: "Pending",
    createdAt: new Date(seedNow - 120_000).toISOString(),
    updatedAt: new Date(seedNow - 120_000).toISOString(),
  },
  {
    id: "seed-backlog-rn-perf",
    title: "Read React Native performance documentation",
    category: "Learning",
    estimatedTime: "30 min",
    status: "Pending",
    createdAt: new Date(seedNow - 180_000).toISOString(),
    updatedAt: new Date(seedNow - 180_000).toISOString(),
  },
];
