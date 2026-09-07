"use client";

import { useMemo, useState } from "react";
import { BranchPreview } from "@/components/branch-generator/BranchPreview";
import { RecentBranches } from "@/components/branch-generator/RecentBranches";
import { Input } from "@/components/ui/Input";
import { Section } from "@/components/ui/Section";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { useRecentBranches } from "@/hooks/useRecentBranches";
import {
  BRANCH_INITIALS,
  BRANCH_PREFIX,
  generateBranchName,
} from "@/utils/branch";

export function BranchGeneratorSection() {
  const [ticket, setTicket] = useState("");
  const { copied, copy } = useCopyToClipboard();
  const { branches, remember } = useRecentBranches();

  const branch = useMemo(() => generateBranchName(ticket), [ticket]);
  const canCopy = Boolean(branch);

  const copyBranch = async (value: string) => {
    const ok = await copy(value);
    if (ok) remember(value);
  };

  return (
    <Section title="Branch Generator">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="branch-ticket" className="text-xs text-muted">
            Ticket
          </label>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-sm text-muted">{BRANCH_PREFIX}</span>
            <span className="text-muted">-</span>
            <Input
              id="branch-ticket"
              value={ticket}
              placeholder="AB-821"
              aria-label="Jira ticket"
              className="w-full font-mono sm:w-44"
              onChange={(event) => setTicket(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && canCopy) {
                  event.preventDefault();
                  void copyBranch(branch);
                }
              }}
            />
            <span className="text-muted">-</span>
            <span className="font-mono text-sm text-muted">{BRANCH_INITIALS}</span>
          </div>
        </div>
        <BranchPreview
          branch={branch}
          copied={copied}
          disabled={!canCopy}
          onCopy={() => {
            if (canCopy) void copyBranch(branch);
          }}
        />
        <RecentBranches
          branches={branches}
          onCopy={(value) => {
            void copyBranch(value);
          }}
        />
      </div>
    </Section>
  );
}
