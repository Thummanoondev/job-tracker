"use client";

import { useState } from "react";
import type { Application } from "@/lib/types";

export function ApplicationCard({
  app,
  onDragStart,
  onDragEnd,
  onEdit,
  onDelete,
}: {
  app: Application;
  onDragStart: () => void;
  onDragEnd: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [confirming, setConfirming] = useState(false);

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className="group cursor-grab rounded-lg bg-white p-3 shadow-sm ring-1 ring-slate-200 transition hover:shadow-md active:cursor-grabbing"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-900">
            {app.position}
          </p>
          <p className="truncate text-xs text-slate-500">{app.company}</p>
        </div>
        <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition group-hover:opacity-100">
          <button
            onClick={onEdit}
            aria-label="Edit"
            className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
            </svg>
          </button>
          <button
            onClick={() => setConfirming(true)}
            aria-label="Delete"
            className="rounded p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
        </div>
      </div>

      {(app.location || app.salary) && (
        <div className="mt-2 flex flex-wrap gap-1">
          {app.location && (
            <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] text-slate-600">
              📍 {app.location}
            </span>
          )}
          {app.salary && (
            <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] text-slate-600">
              💰 {app.salary}
            </span>
          )}
        </div>
      )}

      {app.jobUrl && (
        <a
          href={app.jobUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block text-[11px] font-medium text-blue-600 hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          View posting ↗
        </a>
      )}

      {confirming && (
        <div className="mt-2 flex items-center gap-2 rounded-md bg-rose-50 p-2 text-xs">
          <span className="text-rose-700">Delete this?</span>
          <button
            onClick={onDelete}
            className="ml-auto rounded bg-rose-600 px-2 py-0.5 font-medium text-white hover:bg-rose-700"
          >
            Yes
          </button>
          <button
            onClick={() => setConfirming(false)}
            className="rounded px-2 py-0.5 font-medium text-slate-600 hover:bg-slate-100"
          >
            No
          </button>
        </div>
      )}
    </div>
  );
}
