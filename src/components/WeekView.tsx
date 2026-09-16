import type { Category, Task } from "@/types";
import type { CalendarDay } from "@/lib/calendar";
import { getWeekdayLabels, isSameDay, toISODate } from "@/lib/calendar";

const MAX_VISIBLE_TASKS = 4;

interface WeekViewProps {
  days: CalendarDay[];
  today: Date;
  selectedDate: Date;
  tasksByDate: Map<string, Task[]>;
  categories: Category[];
  onSelectDate: (date: Date) => void;
}

export function WeekView({
  days,
  today,
  selectedDate,
  tasksByDate,
  categories,
  onSelectDate,
}: WeekViewProps) {
  const weekdayLabels = getWeekdayLabels();

  return (
    <div className="grid h-full grid-cols-7 gap-1.5">
      {days.map((day, i) => {
        const iso = toISODate(day.date);
        const tasks = tasksByDate.get(iso) ?? [];
        const isToday = isSameDay(day.date, today);
        const isSelected = isSameDay(day.date, selectedDate);
        const isSun = i === 6;
        const isSat = i === 5;

        const cardClasses = isToday
          ? "border-ink bg-yellow"
          : isSelected
            ? "border-ink bg-white"
            : "border-transparent bg-lavender/50";

        return (
          <button
            key={iso}
            type="button"
            onClick={() => onSelectDate(day.date)}
            className={`flex h-full flex-col overflow-hidden rounded-xl border-2 p-1.5 text-left transition-colors ${cardClasses}`}
          >
            <div className="mb-1 flex items-center justify-between shrink-0">
              <span
                className={`text-[10px] font-bold ${
                  isSun ? "text-coral" : isSat ? "text-[#5b52a0]" : "text-neutral-500"
                }`}
              >
                {weekdayLabels[i]}
              </span>
              <span
                className={`text-xs font-extrabold ${
                  isToday ? "text-[#2a2200]" : "text-[#2a2560]"
                }`}
              >
                {day.day}
              </span>
            </div>

            <div className="flex min-h-0 flex-1 flex-col gap-1 overflow-hidden">
              {tasks.slice(0, MAX_VISIBLE_TASKS).map((task) => {
                const category = categories.find((c) => c.id === task.categoryId);
                return (
                  <div
                    key={task.id}
                    style={{
                      backgroundColor: category?.bg ?? "#eee",
                      color: category?.text ?? "#333",
                    }}
                    className={`truncate rounded px-1 py-0.5 text-[9px] font-bold ${
                      task.done ? "opacity-50 line-through" : ""
                    }`}
                  >
                    {task.title}
                  </div>
                );
              })}
              {tasks.length > MAX_VISIBLE_TASKS && (
                <div className="text-[9px] font-bold text-neutral-400">
                  +{tasks.length - MAX_VISIBLE_TASKS}개 더보기
                </div>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
