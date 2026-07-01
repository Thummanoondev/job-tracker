import type { Metadata } from "next";
import { AuthForm } from "@/components/AuthForm";
import { login } from "@/app/actions/auth";

export const metadata: Metadata = { title: "Sign in · JobTrackr" };

export default function LoginPage() {
  return (
    <>
      <h1 className="mb-1 text-xl font-bold text-slate-900">Welcome back</h1>
      <p className="mb-6 text-sm text-slate-500">
        Sign in to manage your job applications.
      </p>
      <AuthForm mode="login" onSubmit={login} />
    </>
  );
}
