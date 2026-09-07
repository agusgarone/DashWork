"use client";

import { useCallback, useSyncExternalStore } from "react";
import { linksStore } from "@/services/storage";
import type { LinkIconName, QuickLink } from "@/types";
import { createId } from "@/utils/id";
import { normalizeUrl } from "@/utils/url";

export type LinkDraft = {
  name: string;
  url: string;
  icon?: LinkIconName;
};

function withOrder(links: QuickLink[]): QuickLink[] {
  return links.map((link, index) => ({ ...link, order: index }));
}

export function useLinks() {
  const links = useSyncExternalStore(
    linksStore.subscribe,
    linksStore.getSnapshot,
    linksStore.getServerSnapshot,
  );

  const persist = useCallback((next: QuickLink[]) => {
    linksStore.set(withOrder(next));
  }, []);

  const addLink = useCallback(
    (draft: LinkDraft) => {
      const link: QuickLink = {
        id: createId(),
        name: draft.name.trim(),
        url: normalizeUrl(draft.url),
        icon: draft.icon,
        order: links.length,
      };
      persist([...links, link]);
    },
    [links, persist],
  );

  const updateLink = useCallback(
    (id: string, draft: LinkDraft) => {
      persist(
        links.map((link) =>
          link.id === id
            ? {
                ...link,
                name: draft.name.trim(),
                url: normalizeUrl(draft.url),
                icon: draft.icon,
              }
            : link,
        ),
      );
    },
    [links, persist],
  );

  const deleteLink = useCallback(
    (id: string) => {
      persist(links.filter((link) => link.id !== id));
    },
    [links, persist],
  );

  const reorderLinks = useCallback(
    (fromIndex: number, toIndex: number) => {
      if (fromIndex === toIndex) return;
      const next = [...links];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      persist(next);
    },
    [links, persist],
  );

  return {
    links,
    addLink,
    updateLink,
    deleteLink,
    reorderLinks,
  };
}
