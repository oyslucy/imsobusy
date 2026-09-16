export type TaskTag = "work" | "life" | "move";

export interface Task {
  id: string;
  title: string;
  time: string;
  tag: TaskTag;
  done: boolean;
  /** ISO date string (yyyy-mm-dd) the task belongs to */
  date: string;
}

export interface DayInfo {
  date: Date;
  inCurrentMonth: boolean;
  isToday: boolean;
  isWeekend: "sat" | "sun" | null;
  /** number of scheduled items on this day, for the dot count under the day number */
  count: number;
  /** whether every task on this day is completed */
  allDone: boolean;
}
