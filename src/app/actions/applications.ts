"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { applicationSchema } from "@/lib/validations";
import { isStatus, STATUSES, type Status } from "@/lib/constants";
import type { Application } from "@/lib/types";

export type ApplicationState = {
  ok?: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
  application?: Application;
};

// Turn "" into null so optional columns stay clean in the DB.
const nullify = (v: FormDataEntryValue | null) => {
  const s = typeof v === "string" ? v.trim() : "";
  return s === "" ? null : s;
};

// Prisma row -> serializable shape for client components.
type Row = {
  id: string;
  company: string;
  position: string;
  location: string | null;
  salary: string | null;
  jobUrl: string | null;
  notes: string | null;
  status: string;
  appliedAt: Date;
};

const toApplication = (r: Row): Application => ({
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
});

export async function createApplication(
  _prev: ApplicationState,
  formData: FormData,
): Promise<ApplicationState> {
  const user = await getCurrentUser();
  if (!user) return { error: "You must be signed in." };

  const parsed = applicationSchema.safeParse({
    company: formData.get("company"),
    position: formData.get("position"),
    location: formData.get("location") ?? "",
    salary: formData.get("salary") ?? "",
    jobUrl: formData.get("jobUrl") ?? "",
    notes: formData.get("notes") ?? "",
    status: formData.get("status"),
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const d = parsed.data;
  const created = await prisma.jobApplication.create({
    data: {
      company: d.company,
      position: d.position,
      location: nullify(d.location ?? ""),
      salary: nullify(d.salary ?? ""),
      jobUrl: nullify(d.jobUrl ?? ""),
      notes: nullify(d.notes ?? ""),
      status: d.status,
      userId: user.id,
    },
  });

  revalidatePath("/dashboard");
  return { ok: true, application: toApplication(created) };
}

export async function updateApplication(
  id: string,
  _prev: ApplicationState,
  formData: FormData,
): Promise<ApplicationState> {
  const user = await getCurrentUser();
  if (!user) return { error: "You must be signed in." };

  const parsed = applicationSchema.safeParse({
    company: formData.get("company"),
    position: formData.get("position"),
    location: formData.get("location") ?? "",
    salary: formData.get("salary") ?? "",
    jobUrl: formData.get("jobUrl") ?? "",
    notes: formData.get("notes") ?? "",
    status: formData.get("status"),
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const d = parsed.data;
  // Scope by userId so a user can only touch their own rows.
  const result = await prisma.jobApplication.updateMany({
    where: { id, userId: user.id },
    data: {
      company: d.company,
      position: d.position,
      location: nullify(d.location ?? ""),
      salary: nullify(d.salary ?? ""),
      jobUrl: nullify(d.jobUrl ?? ""),
      notes: nullify(d.notes ?? ""),
      status: d.status,
    },
  });

  if (result.count === 0) return { error: "Application not found." };

  const updated = await prisma.jobApplication.findUnique({ where: { id } });
  revalidatePath("/dashboard");
  return { ok: true, application: updated ? toApplication(updated) : undefined };
}

/** Used by drag-and-drop / quick status changes on the board. */
export async function updateApplicationStatus(
  id: string,
  status: string,
): Promise<{ ok: boolean }> {
  const user = await getCurrentUser();
  if (!user || !isStatus(status)) return { ok: false };

  await prisma.jobApplication.updateMany({
    where: { id, userId: user.id },
    data: { status: status as Status },
  });

  revalidatePath("/dashboard");
  return { ok: true };
}

export async function deleteApplication(
  id: string,
): Promise<{ ok: boolean }> {
  const user = await getCurrentUser();
  if (!user) return { ok: false };

  await prisma.jobApplication.deleteMany({
    where: { id, userId: user.id },
  });

  revalidatePath("/dashboard");
  return { ok: true };
}
