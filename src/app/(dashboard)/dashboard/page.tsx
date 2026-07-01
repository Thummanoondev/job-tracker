import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { STATUSES, type Status } from "@/lib/constants";
import type { Application } from "@/lib/types";
import { StatsCards } from "@/components/StatsCards";
import { Board } from "@/components/Board";

export const metadata: Metadata = { title: "Dashboard · JobTrackr" };

export default async function DashboardPage() {
  const user = await getCurrentUser();
  // Layout already guards this, but keep the type-checker happy.
  if (!user) return null;

  const rows = await prisma.jobApplication.findMany({
    where: { userId: user.id },
    orderBy: { appliedAt: "desc" },
  });

  const applications: Application[] = rows.map((r) => ({
    id: r.id,
    company: r.company,
    position: r.position,
    location: r.location,
    salary: r.salary,
    jobUrl: r.jobUrl,
    notes: r.notes,
    status: (STATUSES as readonly string[]).includes(r.status)
      ? (r.status as Status)
      : "WISHLIST",
    appliedAt: r.appliedAt.toISOString(),
  }));

  const counts = STATUSES.reduce<Record<Status, number>>(
    (acc, s) => {
      acc[s] = applications.filter((a) => a.status === s).length;
      return acc;
    },
    { WISHLIST: 0, APPLIED: 0, INTERVIEW: 0, OFFER: 0, REJECTED: 0 },
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Your job hunt
        </h1>
        <p className="text-sm text-slate-500">
          {applications.length} application
          {applications.length === 1 ? "" : "s"} tracked
        </p>
      </div>

      <StatsCards counts={counts} total={applications.length} />

      <Board initialApplications={applications} />
    </div>
  );
}
