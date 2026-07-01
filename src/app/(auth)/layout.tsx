import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 py-12">
      <Link href="/" className="mb-8 flex items-center gap-2">
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-slate-900 text-lg font-bold text-white">
          J
        </span>
        <span className="text-xl font-bold tracking-tight text-slate-900">
          JobTrackr
        </span>
      </Link>
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        {children}
      </div>
    </div>
  );
}
