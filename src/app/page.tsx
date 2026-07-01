import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { STATUS_META, STATUSES } from "@/lib/constants";

export default async function Home() {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-slate-900 text-sm font-bold text-white">
            J
          </span>
          <span className="text-lg font-bold tracking-tight text-slate-900">
            JobTrackr
          </span>
        </div>
        <nav className="flex items-center gap-2">
          <Link
            href="/login"
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Get started
          </Link>
        </nav>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <span className="mb-4 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200">
          Your job hunt, organized
        </span>
        <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Track every application from{" "}
          <span className="text-blue-600">wishlist</span> to{" "}
          <span className="text-emerald-600">offer</span>.
        </h1>
        <p className="mt-5 max-w-xl text-lg text-slate-500">
          A clean Kanban board to keep every company, role, and interview in one
          place — so nothing slips through the cracks.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/register"
            className="rounded-lg bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Start tracking — it&apos;s free
          </Link>
          <Link
            href="/login"
            className="rounded-lg border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            I already have an account
          </Link>
        </div>

        <div className="mt-16 flex w-full max-w-3xl flex-wrap justify-center gap-3">
          {STATUSES.map((s) => (
            <div
              key={s}
              className="flex items-center gap-2 rounded-xl bg-white px-4 py-3 shadow-sm ring-1 ring-slate-200"
            >
              <span className={`h-2.5 w-2.5 rounded-full ${STATUS_META[s].dot}`} />
              <span className="text-sm font-medium text-slate-700">
                {STATUS_META[s].label}
              </span>
            </div>
          ))}
        </div>
      </main>

      <footer className="mx-auto w-full max-w-5xl px-6 py-8 text-center text-sm text-slate-400">
        Built with Next.js, Prisma &amp; TypeScript.
      </footer>
    </div>
  );
}
