// The lifecycle of a job application, in board order.
export const STATUSES = [
  "WISHLIST",
  "APPLIED",
  "INTERVIEW",
  "OFFER",
  "REJECTED",
] as const;

export type Status = (typeof STATUSES)[number];

// Human-friendly labels + Tailwind color tokens for each column/badge.
export const STATUS_META: Record<
  Status,
  { label: string; badge: string; dot: string; column: string }
> = {
  WISHLIST: {
    label: "Wishlist",
    badge: "bg-slate-100 text-slate-700 ring-slate-600/20",
    dot: "bg-slate-400",
    column: "border-slate-300",
  },
  APPLIED: {
    label: "Applied",
    badge: "bg-blue-100 text-blue-700 ring-blue-600/20",
    dot: "bg-blue-500",
    column: "border-blue-300",
  },
  INTERVIEW: {
    label: "Interview",
    badge: "bg-amber-100 text-amber-700 ring-amber-600/20",
    dot: "bg-amber-500",
    column: "border-amber-300",
  },
  OFFER: {
    label: "Offer",
    badge: "bg-emerald-100 text-emerald-700 ring-emerald-600/20",
    dot: "bg-emerald-500",
    column: "border-emerald-300",
  },
  REJECTED: {
    label: "Rejected",
    badge: "bg-rose-100 text-rose-700 ring-rose-600/20",
    dot: "bg-rose-500",
    column: "border-rose-300",
  },
};

export function isStatus(value: string): value is Status {
  return (STATUSES as readonly string[]).includes(value);
}
