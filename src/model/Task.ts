export type Task = {
  key?: string;
  createdDate: string;
  description: string;
  status: "WAIT" | "PROCESS" | "DONE";
  tag: "LOW" | "MIDDLE" | "HIGH";
};
