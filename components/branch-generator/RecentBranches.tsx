"use client";

type RecentBranchesProps = {
  branches: string[];
  onCopy: (branch: string) => void;
};

export function RecentBranches({ branches, onCopy }: RecentBranchesProps) {
  if (branches.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs text-muted">Recent branches</p>
      <ul className="flex flex-col">
        {branches.map((branch) => (
          <li key={branch}>
            <button
              type="button"
              onClick={() => onCopy(branch)}
              className="w-full truncate rounded-md px-2 py-1.5 text-left font-mono text-[13px] text-muted transition-colors duration-150 hover:bg-hover hover:text-foreground"
            >
              {branch}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
