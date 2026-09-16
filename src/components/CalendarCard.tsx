import { useState } from "react";
import type { Category, Task } from "@/types";
import {
  buildMonthMatrix,
  buildWeekDays,
  getWeekdayLabels,
  isSameDay,
  monthLabel,
  toISODate,
} from "@/lib/calendar";
import { DayCell } from "@/components/DayCell";
import { WeekView } from "@/components/WeekView";

interface CalendarCardProps {
  viewDate: Date;
  today: Date;
  selectedDate: Date;
  categories: Category[];
  tasksByDate: Map<string, Task[]>;
  onSelectDate: (date: Date) => void;
  onGoToMonth: (delta: number) => void;
}

const CALENDAR_BODY_HEIGHT = "h-[419px]";

export function CalendarCard({
  viewDate,
  today,
  selectedDate,
  categories,
  tasksByDate,
  onSelectDate,
  onGoToMonth,
}: CalendarCardProps) {
  const [viewMode, setViewMode] = useState<"month" | "week">("month");
  const [weekAnchor, setWeekAnchor] = useState<Date>(selectedDate);

  const matrix = buildMonthMatrix(viewDate);
  const weekDays = buildWeekDays(weekAnchor);
  const { month, year } = monthLabel(viewMode === "week" ? weekAnchor : viewDate);
  const weekdayLabels = getWeekdayLabels();

  function switchMode(mode: "month" | "week") {
    if (mode === "week") setWeekAnchor(selectedDate);
    setViewMode(mode);
  }

  function goPrev() {
    if (viewMode === "week") {
      setWeekAnchor((prev) => {
        const d = new Date(prev);
        d.setDate(d.getDate() - 7);
        return d;
      });
    } else {
      onGoToMonth(-1);
    }
  }

  function goNext() {
    if (viewMode === "week") {
      setWeekAnchor((prev) => {
        const d = new Date(prev);
        d.setDate(d.getDate() + 7);
        return d;
      });
    } else {
      onGoToMonth(1);
    }
  }

  return (
    <div className="rounded-card border-[2.5px] border-ink bg-white p-4 sm:p-[22px]">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="text-[22px] font-extrabold sm:text-[26px]">
          {month} <span className="ml-1 text-base font-bold text-neutral-400">{year}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex overflow-hidden rounded-[10px] border-2 border-ink text-[12.5px] font-bold">
            <span
              className={`cursor-pointer px-[14px] py-[7px] ${viewMode === "month" ? "bg-ink text-white" : "bg-white text-neutral-700"}`}
              onClick={() => switchMode("month")}
            >
              MONTH
            </span>
            <span
              className={`cursor-pointer px-[14px] py-[7px] ${viewMode === "week" ? "bg-ink text-white" : "bg-white text-neutral-700"}`}
              onClick={() => switchMode("week")}
            >
              WEEK
            </span>
          </div>
          <button
            type="button"
            aria-label={viewMode === "week" ? "이전 주" : "이전 달"}
            onClick={goPrev}
            className="flex h-[34px] w-[34px] items-center justify-center rounded-[9px] border-2 border-ink bg-white font-extrabold"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label={viewMode === "week" ? "다음 주" : "다음 달"}
            onClick={goNext}
            className="flex h-[34px] w-[34px] items-center justify-center rounded-[9px] border-2 border-ink bg-white font-extrabold"
          >
            ›
          </button>
        </div>
      </div>

      {viewMode === "month" ? (
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
      ) : (
        <div className={CALENDAR_BODY_HEIGHT}>
          <WeekView
            days={weekDays}
            today={today}
            selectedDate={selectedDate}
            tasksByDate={tasksByDate}
            categories={categories}
            onSelectDate={onSelectDate}
          />
        </div>
      )}
    </div>
  );
}
