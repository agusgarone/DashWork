"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { SlideOver } from "@/components/ui/SlideOver";
import { Textarea } from "@/components/ui/Textarea";
import type { BacklogDraft } from "@/hooks/useBacklog";
import {
  BACKLOG_CATEGORIES,
  BACKLOG_STATUSES,
  ESTIMATED_TIMES,
  type BacklogItem,
} from "@/types";

type BacklogItemPanelProps = {
  open: boolean;
  mode: "create" | "edit";
  item?: BacklogItem;
  onClose: () => void;
  onSave: (draft: BacklogDraft) => void;
  onDelete?: (id: string) => void;
};

const EMPTY_DRAFT: BacklogDraft = {
  title: "",
  description: "",
  category: "Work",
  estimatedTime: "30 min",
  status: "Pending",
};

function draftFromItem(item?: BacklogItem): BacklogDraft {
  if (!item) return EMPTY_DRAFT;
  return {
    title: item.title,
    description: item.description ?? "",
    category: item.category,
    estimatedTime: item.estimatedTime,
    status: item.status,
  };
}

export function BacklogItemPanel({
  open,
  mode,
  item,
  onClose,
  onSave,
  onDelete,
}: BacklogItemPanelProps) {
  const [draft, setDraft] = useState<BacklogDraft>(() => draftFromItem(item));

  const canSave = draft.title.trim().length > 0;

  const submit = () => {
    if (!canSave) return;
    onSave(draft);
    onClose();
  };

  return (
    <SlideOver
      open={open}
      title={mode === "create" ? "Add item" : "Task"}
      onClose={onClose}
    >
      <form
        className="flex h-full flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        <Field label="Title" htmlFor="item-title">
          <Input
            id="item-title"
            value={draft.title}
            placeholder="Review authentication flow"
            onChange={(event) =>
              setDraft((current) => ({ ...current, title: event.target.value }))
            }
          />
        </Field>
        <Field label="Description" htmlFor="item-description">
          <Textarea
            id="item-description"
            value={draft.description}
            placeholder="Optional notes"
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                description: event.target.value,
              }))
            }
          />
        </Field>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Category" htmlFor="item-category">
            <Select
              id="item-category"
              value={draft.category}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  category: event.target
                    .value as BacklogDraft["category"],
                }))
              }
            >
              {BACKLOG_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Estimated time" htmlFor="item-time">
            <Select
              id="item-time"
              value={draft.estimatedTime}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  estimatedTime: event.target
                    .value as BacklogDraft["estimatedTime"],
                }))
              }
            >
              {ESTIMATED_TIMES.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </Select>
          </Field>
        </div>
        <Field label="Status" htmlFor="item-status">
          <Select
            id="item-status"
            value={draft.status}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                status: event.target.value as BacklogDraft["status"],
              }))
            }
          >
            {BACKLOG_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </Select>
        </Field>
        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          {mode === "edit" && item && onDelete ? (
            <Button
              variant="danger"
              onClick={() => {
                onDelete(item.id);
                onClose();
              }}
            >
              Delete
            </Button>
          ) : (
            <span />
          )}
          <div className="flex gap-2">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={!canSave}>
              Save
            </Button>
          </div>
        </div>
      </form>
    </SlideOver>
  );
}
