import type { Metadata } from "next";
import { AuthForm } from "@/components/AuthForm";
import { register } from "@/app/actions/auth";

export const metadata: Metadata = { title: "Sign up · JobTrackr" };

export default function RegisterPage() {
  return (
    <>
      <h1 className="mb-1 text-xl font-bold text-slate-900">
        Create your account
      </h1>
      <p className="mb-6 text-sm text-slate-500">
        Start tracking your job hunt in one place.
      </p>
      <AuthForm mode="register" onSubmit={register} />
    </>
  );
}
