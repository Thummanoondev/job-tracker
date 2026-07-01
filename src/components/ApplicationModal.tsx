"use client";

import { useActionState, useEffect, useRef } from "react";
import { STATUSES, STATUS_META } from "@/lib/constants";
import type { Application } from "@/lib/types";
import {
  createApplication,
  updateApplication,
  type ApplicationState,
} from "@/app/actions/applications";
import { SubmitButton } from "./SubmitButton";

export function ApplicationModal({
  application,
  onClose,
  onSaved,
}: {
  application: Application | null;
  onClose: () => void;
  onSaved: (app: Application) => void;
}) {
  const isEdit = Boolean(application);

  // Bind the id for edits; keep the (prev, formData) shape either way.
  const action = isEdit
    ? updateApplication.bind(null, application!.id)
    : createApplication;

  const [state, formAction] = useActionState<ApplicationState, FormData>(
    action,
    {},
  );

  // Bubble the saved record up to the board once the server confirms.
  const savedRef = useRef(false);
  useEffect(() => {
    if (state.ok && state.application && !savedRef.current) {
      savedRef.current = true;
      onSaved(state.application);
    }
  }, [state, onSaved]);

  // Close on Escape.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">
            {isEdit ? "Edit application" : "New application"}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {state.error && (
          <p className="mb-3 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 ring-1 ring-rose-600/20">
            {state.error}
          </p>
        )}

        <form action={formAction} className="space-y-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <ModalField
              label="Position *"
              name="position"
              defaultValue={application?.position}
              placeholder="Frontend Developer"
              errors={state.fieldErrors?.position}
            />
            <ModalField
              label="Company *"
              name="company"
              defaultValue={application?.company}
              placeholder="Acme Inc."
              errors={state.fieldErrors?.company}
            />
            <ModalField
              label="Location"
              name="location"
              defaultValue={application?.location ?? ""}
              placeholder="Remote · Bangkok"
            />
            <ModalField
              label="Salary"
              name="salary"
              defaultValue={application?.salary ?? ""}
              placeholder="฿60k–80k"
            />
          </div>

          <ModalField
            label="Job posting URL"
            name="jobUrl"
            type="url"
            defaultValue={application?.jobUrl ?? ""}
            placeholder="https://…"
            errors={state.fieldErrors?.jobUrl}
          />

          <div className="space-y-1">
            <label htmlFor="status" className="block text-sm font-medium text-slate-700">
              Status
            </label>
            <select
              id="status"
              name="status"
              defaultValue={application?.status ?? "WISHLIST"}
              className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {STATUS_META[s].label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label htmlFor="notes" className="block text-sm font-medium text-slate-700">
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              defaultValue={application?.notes ?? ""}
              placeholder="Recruiter contact, interview dates, prep notes…"
              className="block w-full resize-none rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>
            <div className="flex-1">
              <SubmitButton pendingText="Saving…">
                {isEdit ? "Save changes" : "Add application"}
              </SubmitButton>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function ModalField({
  label,
  errors,
  ...props
}: {
  label: string;
  errors?: string[];
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-1">
      <label htmlFor={props.name} className="block text-sm font-medium text-slate-700">
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
