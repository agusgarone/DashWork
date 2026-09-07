import {
  BookOpen,
  Component,
  GitBranch,
  Globe,
  LayoutGrid,
  Link as LinkIcon,
  Terminal,
  Ticket,
} from "lucide-react";
import type { LinkIconName } from "@/types";

export function LinkGlyph({
  name,
  fallback,
}: {
  name?: LinkIconName;
  fallback: string;
}) {
  if (!name) {
    return <>{fallback}</>;
  }

  switch (name) {
    case "link":
      return <LinkIcon size={12} strokeWidth={1.75} />;
    case "globe":
      return <Globe size={12} strokeWidth={1.75} />;
    case "layout-grid":
      return <LayoutGrid size={12} strokeWidth={1.75} />;
    case "git-branch":
      return <GitBranch size={12} strokeWidth={1.75} />;
    case "component":
      return <Component size={12} strokeWidth={1.75} />;
    case "ticket":
      return <Ticket size={12} strokeWidth={1.75} />;
    case "book-open":
      return <BookOpen size={12} strokeWidth={1.75} />;
    case "terminal":
      return <Terminal size={12} strokeWidth={1.75} />;
    default:
      return <>{fallback}</>;
  }
}
