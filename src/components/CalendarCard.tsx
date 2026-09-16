import { useState } from "react";
import type { Task } from "@/types";
import {
  buildMonthMatrix,
  getWeekdayLabels,
  isBeforeDay,
  isSameDay,
  monthLabel,
  toISODate,
} from "@/lib/calendar";
import { DayCell } from "@/components/DayCell";

interface CalendarCardProps {
  viewDate: Date;
  today: Date;
  selectedDate: Date;
  tasksByDate: Map<string, Task[]>;
  onSelectDate: (date: Date) => void;
  onGoToMonth: (delta: number) => void;
}

export function CalendarCard({
  viewDate,
  today,
  selectedDate,
  tasksByDate,
  onSelectDate,
  onGoToMonth,
}: CalendarCardProps) {
  const [viewMode, setViewMode] = useState<"month" | "week">("month");
  const matrix = buildMonthMatrix(viewDate);
  const { month, year } = monthLabel(viewDate);
  const weekdayLabels = getWeekdayLabels();

  return (
    <div className="rounded-card border-[2.5px] border-ink bg-white p-[22px]">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-[26px] font-extrabold">
          {month} <span className="ml-1 text-base font-bold text-neutral-400">{year}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex overflow-hidden rounded-[10px] border-2 border-ink text-[12.5px] font-bold">
            <span
              className={`cursor-pointer px-[14px] py-[7px] ${viewMode === "month" ? "bg-ink text-white" : "bg-white text-neutral-700"}`}
              onClick={() => setViewMode("month")}
            >
              MONTH
            </span>
            <span
              className={`cursor-pointer px-[14px] py-[7px] ${viewMode === "week" ? "bg-ink text-white" : "bg-white text-neutral-700"}`}
              onClick={() => setViewMode("week")}
            >
              WEEK
            </span>
          </div>
          <button
            type="button"
            aria-label="이전 달"
            onClick={() => onGoToMonth(-1)}
            className="flex h-[34px] w-[34px] items-center justify-center rounded-[9px] border-2 border-ink bg-white font-extrabold"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="다음 달"
            onClick={() => onGoToMonth(1)}
            className="flex h-[34px] w-[34px] items-center justify-center rounded-[9px] border-2 border-ink bg-white font-extrabold"
          >
            ›
          </button>
        </div>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr>
            {weekdayLabels.map((label, i) => (
              <th
                key={label}
                className={`pb-2 text-center text-[12.5px] font-bold ${
                  i === 6 ? "text-coral" : "text-neutral-500"
                }`}
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {matrix.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) => {
                const iso = cell ? toISODate(cell.date) : "";
                const dayTasks = cell ? (tasksByDate.get(iso) ?? []) : [];
                return (
                  <td key={ci} className="p-1 align-top text-center">
                    <DayCell
                      cell={cell}
                      isToday={cell ? isSameDay(cell.date, today) : false}
                      isSelected={cell ? isSameDay(cell.date, selectedDate) : false}
                      isPast={cell ? isBeforeDay(cell.date, today) : false}
                      weekendKind={ci === 5 ? "sat" : ci === 6 ? "sun" : null}
                      taskCount={dayTasks.length}
                      allDone={dayTasks.length > 0 && dayTasks.every((t) => t.done)}
                      onSelect={onSelectDate}
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
