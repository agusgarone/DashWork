const COMBINING_MARKS = /[\u0300-\u036f]/g;
const NON_ALNUM = /[^a-z0-9]+/g;
const TICKET_SEPARATORS = /[^A-Z0-9]+/g;
const EDGE_HYPHENS = /^-+|-+$/g;

export const BRANCH_PREFIX = "testing";
export const BRANCH_INITIALS = "AG";

export function stripDiacritics(value: string): string {
  return value.normalize("NFD").replace(COMBINING_MARKS, "");
}

export function sanitizeBranchDescription(description: string): string {
  return stripDiacritics(description)
    .toLowerCase()
    .replace(NON_ALNUM, "-")
    .replace(EDGE_HYPHENS, "");
}

export function sanitizeTicketId(ticket: string): string {
  return stripDiacritics(ticket)
    .toUpperCase()
    .replace(TICKET_SEPARATORS, "-")
    .replace(EDGE_HYPHENS, "");
}

export function generateBranchName(ticket: string): string {
  const ticketId = sanitizeTicketId(ticket);
  if (!ticketId) return "";
  return `${BRANCH_PREFIX}-${ticketId}-${BRANCH_INITIALS}`;
}
