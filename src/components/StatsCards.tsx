import { STATUSES, STATUS_META, type Status } from "@/lib/constants";

export function StatsCards({
  counts,
  total,
}: {
  counts: Record<Status, number>;
  total: number;
}) {
  // Response rate = anything that moved past "applied" out of applications sent.
  const sent = counts.APPLIED + counts.INTERVIEW + counts.OFFER + counts.REJECTED;
  const responded = counts.INTERVIEW + counts.OFFER;
  const responseRate = sent > 0 ? Math.round((responded / sent) * 100) : 0;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      <div className="rounded-xl bg-white p-4 ring-1 ring-slate-200">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Total
        </p>
        <p className="mt-1 text-2xl font-bold text-slate-900">{total}</p>
      </div>
      {STATUSES.map((s) => (
        <div key={s} className="rounded-xl bg-white p-4 ring-1 ring-slate-200">
          <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-500">
            <span className={`h-2 w-2 rounded-full ${STATUS_META[s].dot}`} />
            {STATUS_META[s].label}
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{counts[s]}</p>
        </div>
      ))}
      <div className="col-span-2 rounded-xl bg-slate-900 p-4 sm:col-span-3 lg:col-span-6">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-300">
          Response rate
        </p>
        <div className="mt-2 flex items-center gap-3">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-700">
            <div
              className="h-full rounded-full bg-emerald-400 transition-all"
              style={{ width: `${responseRate}%` }}
            />
          </div>
          <span className="text-sm font-semibold text-white">
            {responseRate}%
          </span>
        </div>
      </div>
    </div>
  );
}
