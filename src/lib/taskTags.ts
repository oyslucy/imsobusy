import type { TaskTag } from "@/types";

export const TASK_TAGS: { key: TaskTag; label: string; className: string }[] = [
  { key: "work", label: "WORK", className: "bg-lavender text-[#2a2560]" },
  { key: "life", label: "LIFE", className: "bg-coral text-[#3a1000]" },
  { key: "move", label: "MOVE", className: "bg-mint text-[#0a3a2a]" },
];
