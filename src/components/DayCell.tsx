import type { CalendarDay } from "@/lib/calendar";

interface DayCellProps {
  cell: CalendarDay | null;
  isToday: boolean;
  isSelected: boolean;
  weekendKind: "sat" | "sun" | null;
  taskCount: number;
  allDone: boolean;
  onSelect: (date: Date) => void;
}

export function DayCell({
  cell,
  isToday,
  isSelected,
  weekendKind,
  taskCount,
  allDone,
  onSelect,
}: DayCellProps) {
  if (!cell) {
    return <div className="aspect-[1/0.92] w-full" />;
  }

  const showCheck = taskCount > 0 && allDone;

  const stateClasses = isToday
    ? "border-ink bg-yellow text-[#2a2200]"
    : isSelected
      ? "border-ink bg-white text-[#2a2560]"
      : "border-transparent bg-lavender text-[#2a2560]";

  const numberColor =
    !isToday && !isSelected
      ? weekendKind === "sun"
        ? "text-[#c96b52]"
        : weekendKind === "sat"
          ? "text-[#5b52a0]"
          : ""
      : "";

  return (
    <button
      type="button"
      onClick={() => onSelect(cell.date)}
      className={`relative flex aspect-[1/0.92] w-full flex-col items-center justify-center rounded-xl border-2 font-extrabold text-base transition-colors ${stateClasses}`}
    >
      {isToday && (
        <div className="absolute -top-[9px] left-1/2 -translate-x-1/2 rounded-md bg-ink px-[7px] py-0.5 text-[8.5px] font-extrabold tracking-wide text-yellow">
          TODAY
        </div>
      )}
      {showCheck && (
        <div className="absolute -right-1 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full border-[1.5px] border-ink bg-yellow text-[9px] font-black">
          ✓
        </div>
      )}
      <div className={numberColor}>{cell.day}</div>
      {taskCount > 0 && (
        <div
          className={`mt-0.5 text-[9.5px] font-bold tracking-widest ${
            isToday || isSelected ? "text-neutral-400" : "text-[#5b52a0]"
          }`}
        >
          · {taskCount} ·
        </div>
      )}
    </button>
  );
}
