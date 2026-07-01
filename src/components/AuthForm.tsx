"use client";

import Link from "next/link";
import { useActionState } from "react";
import { SubmitButton } from "./SubmitButton";
import type { AuthState } from "@/app/actions/auth";

type Mode = "login" | "register";

const action = (mode: Mode) =>
  mode === "login" ? "Sign in" : "Create account";

export function AuthForm({
  mode,
  onSubmit,
}: {
  mode: Mode;
  onSubmit: (prev: AuthState, formData: FormData) => Promise<AuthState>;
}) {
  const [state, formAction] = useActionState<AuthState, FormData>(onSubmit, {});

  return (
    <form action={formAction} className="space-y-4">
      {state.error && (
        <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 ring-1 ring-rose-600/20">
          {state.error}
        </p>
      )}

      {mode === "register" && (
        <Field
          label="Full name"
          name="name"
          type="text"
          autoComplete="name"
          placeholder="Ada Lovelace"
          errors={state.fieldErrors?.name}
        />
      )}

      <Field
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        errors={state.fieldErrors?.email}
      />

      <Field
        label="Password"
        name="password"
        type="password"
        autoComplete={mode === "login" ? "current-password" : "new-password"}
        placeholder="••••••••"
        errors={state.fieldErrors?.password}
      />

      <SubmitButton pendingText="Please wait…">{action(mode)}</SubmitButton>

      <p className="text-center text-sm text-slate-500">
        {mode === "login" ? (
          <>
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-semibold text-slate-900 hover:underline">
              Sign up
            </Link>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-slate-900 hover:underline">
              Sign in
            </Link>
          </>
        )}
      </p>
    </form>
  );
}

function Field({
  label,
  errors,
  ...props
}: {
  label: string;
  errors?: string[];
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-1">
      <label
        htmlFor={props.name}
        className="block text-sm font-medium text-slate-700"
      >
        {label}
      </label>
      <input
        id={props.name}
        {...props}
        className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
      />
      {errors?.map((e) => (
        <p key={e} className="text-xs text-rose-600">
          {e}
        </p>
      ))}
    </div>
  );
}
