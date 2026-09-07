"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import type { LinkDraft } from "@/hooks/useLinks";
import { LINK_ICON_NAMES, type LinkIconName, type QuickLink } from "@/types";

type LinkFormDialogProps = {
  open: boolean;
  link?: QuickLink | null;
  onClose: () => void;
  onSubmit: (draft: LinkDraft) => void;
};

function draftFromLink(link?: QuickLink | null): LinkDraft {
  if (!link) return { name: "", url: "", icon: undefined };
  return { name: link.name, url: link.url, icon: link.icon };
}

export function LinkFormDialog({
  open,
  link,
  onClose,
  onSubmit,
}: LinkFormDialogProps) {
  const [draft, setDraft] = useState<LinkDraft>(() => draftFromLink(link));
  const canSave = draft.name.trim().length > 0 && draft.url.trim().length > 0;

  const submit = () => {
    if (!canSave) return;
    onSubmit({
      name: draft.name,
      url: draft.url,
      icon: draft.icon,
    });
    onClose();
  };

  return (
    <Modal
      open={open}
      title={link ? "Edit link" : "Add link"}
      onClose={onClose}
    >
      <form
        className="flex flex-col gap-3"
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        <Field label="Name" htmlFor="link-name">
          <Input
            id="link-name"
            value={draft.name}
            placeholder="Jira"
            onChange={(event) =>
              setDraft((current) => ({ ...current, name: event.target.value }))
            }
          />
        </Field>
        <Field label="URL" htmlFor="link-url">
          <Input
            id="link-url"
            value={draft.url}
            placeholder="https://jira.atlassian.com"
            onChange={(event) =>
              setDraft((current) => ({ ...current, url: event.target.value }))
            }
          />
        </Field>
        <Field label="Icon" htmlFor="link-icon">
          <Select
            id="link-icon"
            value={draft.icon ?? ""}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                icon: (event.target.value || undefined) as
                  | LinkIconName
                  | undefined,
              }))
            }
          >
            <option value="">Letter</option>
            {LINK_ICON_NAMES.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </Select>
        </Field>
        <div className="mt-2 flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={!canSave}>
            Save
          </Button>
        </div>
      </form>
    </Modal>
  );
}
