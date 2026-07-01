"use client";

import { useState, useTransition } from "react";
import { STATUSES, STATUS_META, type Status } from "@/lib/constants";
import type { Application } from "@/lib/types";
import {
  deleteApplication,
  updateApplicationStatus,
} from "@/app/actions/applications";
import { ApplicationCard } from "./ApplicationCard";
import { ApplicationModal } from "./ApplicationModal";

export function Board({
  initialApplications,
}: {
  initialApplications: Application[];
}) {
  const [apps, setApps] = useState<Application[]>(initialApplications);
  const [dragId, setDragId] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<Status | null>(null);
  const [editing, setEditing] = useState<Application | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [, startTransition] = useTransition();

  function openCreate() {
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(app: Application) {
    setEditing(app);
    setModalOpen(true);
  }

  function moveCard(id: string, status: Status) {
    const current = apps.find((a) => a.id === id);
    if (!current || current.status === status) return;

    // Optimistic update; reconcile via revalidatePath on the server.
    setApps((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a)),
    );
    startTransition(async () => {
      const res = await updateApplicationStatus(id, status);
      if (!res.ok) {
        // Roll back on failure.
        setApps((prev) =>
          prev.map((a) =>
            a.id === id ? { ...a, status: current.status } : a,
          ),
        );
      }
    });
  }

  function handleDelete(id: string) {
    const snapshot = apps;
    setApps((prev) => prev.filter((a) => a.id !== id));
    startTransition(async () => {
      const res = await deleteApplication(id);
      if (!res.ok) setApps(snapshot);
    });
  }

  function handleSaved(app: Application) {
    setApps((prev) => {
      const exists = prev.some((a) => a.id === app.id);
      return exists
        ? prev.map((a) => (a.id === app.id ? app : a))
        : [app, ...prev];
    });
    setModalOpen(false);
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Board
        </h2>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
        >
          <span className="text-base leading-none">+</span> Add application
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {STATUSES.map((status) => {
          const columnApps = apps.filter((a) => a.status === status);
          const meta = STATUS_META[status];
          return (
            <div
              key={status}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(status);
              }}
              onDragLeave={() => setDragOver((s) => (s === status ? null : s))}
              onDrop={() => {
                if (dragId) moveCard(dragId, status);
                setDragId(null);
                setDragOver(null);
              }}
              className={`flex min-h-[8rem] flex-col rounded-xl border-2 border-dashed bg-slate-100/60 p-2 transition ${
                dragOver === status
                  ? `${meta.column} bg-slate-100`
                  : "border-transparent"
              }`}
            >
              <div className="mb-2 flex items-center justify-between px-1">
                <span className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                  <span className={`h-2 w-2 rounded-full ${meta.dot}`} />
                  {meta.label}
                </span>
                <span className="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-slate-500 ring-1 ring-slate-200">
                  {columnApps.length}
                </span>
              </div>

              <div className="flex flex-1 flex-col gap-2">
                {columnApps.map((app) => (
                  <ApplicationCard
                    key={app.id}
                    app={app}
                    onDragStart={() => setDragId(app.id)}
                    onDragEnd={() => setDragId(null)}
                    onEdit={() => openEdit(app)}
                    onDelete={() => handleDelete(app.id)}
                  />
                ))}
                {columnApps.length === 0 && (
                  <p className="px-1 py-4 text-center text-xs text-slate-400">
                    Drop here
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {modalOpen && (
        <ApplicationModal
          application={editing}
          onClose={() => setModalOpen(false)}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}
