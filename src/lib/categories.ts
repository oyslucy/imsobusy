import type { Category } from "@/types";

export const CATEGORY_PALETTE: { bg: string; text: string }[] = [
  { bg: "#c9c2f0", text: "#2a2560" },
  { bg: "#ef8a72", text: "#3a1000" },
  { bg: "#7fd1b9", text: "#0a3a2a" },
  { bg: "#a8d8f0", text: "#123a52" },
  { bg: "#f6c445", text: "#3a3200" },
  { bg: "#f2b8d4", text: "#4a0f2c" },
  { bg: "#d8d4c8", text: "#33302a" },
  { bg: "#b8e0a0", text: "#1f3d0a" },
];

export const DEFAULT_CATEGORIES: Category[] = [
  { id: "work", label: "WORK", bg: CATEGORY_PALETTE[0].bg, text: CATEGORY_PALETTE[0].text },
  { id: "life", label: "LIFE", bg: CATEGORY_PALETTE[1].bg, text: CATEGORY_PALETTE[1].text },
  { id: "move", label: "MOVE", bg: CATEGORY_PALETTE[2].bg, text: CATEGORY_PALETTE[2].text },
];
