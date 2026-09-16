export interface CalendarDay {
  date: Date;
  day: number;
}

export type CalendarMatrix = (CalendarDay | null)[][];

const WEEKDAY_LABELS_KO = ["월", "화", "수", "목", "금", "토", "일"] as const;

export function getWeekdayLabels(): readonly string[] {
  return WEEKDAY_LABELS_KO;
}

/** Builds a Monday-start month grid, leaving null for cells outside the month. */
export function buildMonthMatrix(viewDate: Date): CalendarMatrix {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay(); // 0=Sun..6=Sat
  const offset = (firstWeekday + 6) % 7; // 0=Mon..6=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const rows = Math.ceil((offset + daysInMonth) / 7);

  const matrix: CalendarMatrix = [];
  let day = 1;
  for (let r = 0; r < rows; r++) {
    const row: (CalendarDay | null)[] = [];
    for (let c = 0; c < 7; c++) {
      const cellIndex = r * 7 + c;
      if (cellIndex < offset || day > daysInMonth) {
        row.push(null);
      } else {
        row.push({ date: new Date(year, month, day), day });
        day++;
      }
    }
    matrix.push(row);
  }
  return matrix;
}

export function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function isSameDay(a: Date, b: Date): boolean {
  return toISODate(a) === toISODate(b);
}

export function isBeforeDay(a: Date, b: Date): boolean {
  return toISODate(a) < toISODate(b);
}

export function addMonths(date: Date, delta: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + delta, 1);
}

export function addDays(date: Date, delta: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + delta);
  return d;
}

export function monthLabel(date: Date): { month: string; year: string } {
  const month = date.toLocaleDateString("en-US", { month: "long" });
  const year = `'${String(date.getFullYear()).slice(2)}`;
  return { month, year };
}

/** Deterministic decorative count for days without real task data. */
export function seededCount(day: number): number {
  return ((day * 53) % 6) + 1;
}
