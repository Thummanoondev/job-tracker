import type { Status } from "./constants";

// Serializable shape passed from server components to client components.
export type Application = {
  id: string;
  company: string;
  position: string;
  location: string | null;
  salary: string | null;
  jobUrl: string | null;
  notes: string | null;
  status: Status;
  appliedAt: string; // ISO string
};
