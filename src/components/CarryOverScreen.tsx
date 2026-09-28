import { useRef, useState, type ReactNode } from "react";
import type { Category, Task } from "@/types";
import { addDays, toISODate } from "@/lib/calendar";

interface CarryOverScreenProps {
  today: Date;
  tasks: Task[];
  categories: Category[];
  onMove: (ids: string[], date: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

function formatDateLabel(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString("ko-KR", { month: "long", day: "numeric", weekday: "short" });
}

function groupByDate(tasks: Task[]): [string, Task[]][] {
  const groups = new Map<string, Task[]>();
  for (const task of tasks) {
    const list = groups.get(task.date) ?? [];
    list.push(task);
    groups.set(task.date, list);
  }
  return [...groups.entries()];
}

export function CarryOverScreen({
  today,
  tasks,
  categories,
  onMove,
  onDelete,
}: CarryOverScreenProps) {
  const [busyId, setBusyId] = useState<string | null>(null);
  const todayISO = toISODate(today);
  const tomorrowISO = toISODate(addDays(today, 1));

  async function run(id: string, action: () => Promise<void>) {
    setBusyId(id);
    try {
      await action();
    } catch (err) {
      console.error("일정을 옮기지 못했어요", err);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="mb-1 flex items-baseline justify-between">
        <div className="text-[22px] font-extrabold">밀린 일정</div>
        <div className="text-[15px] font-bold text-[#4a3fa0]">{tasks.length}개</div>
      </div>
      <div className="mb-4 text-[12px] font-semibold text-neutral-500">
        끝내지 못한 지난 일정을 앞으로 보내요
      </div>

      {tasks.length > 0 && (
        <button
          type="button"
          disabled={busyId !== null}
          onClick={() => run("all", () => onMove(tasks.map((t) => t.id), todayISO))}
          className="mb-3 rounded-2xl border-[2.5px] border-ink bg-yellow py-3 text-[13.5px] font-bold disabled:opacity-60"
        >
          ➤ 전부 오늘로 넘기기
        </button>
      )}

      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto pr-1">
        {tasks.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 py-10 text-sm font-semibold text-neutral-400">
            <span className="text-3xl">🎉</span>
            밀린 일정이 없어요
          </div>
        ) : (
          groupByDate(tasks).map(([date, group]) => (
            <div key={date}>
              <div className="mb-1.5 text-[11px] font-bold tracking-[1px] text-[#8a83b8]">
                {formatDateLabel(date)}
              </div>
              <div className="flex flex-col gap-2">
                {group.map((task) => {
                  const category = categories.find((c) => c.id === task.categoryId);
                  const isBusy = busyId === task.id || busyId === "all";
                  return (
                    <div
                      key={task.id}
                      className={`rounded-2xl border-2 border-ink bg-white px-4 py-3 ${
                        isBusy ? "opacity-60" : ""
                      }`}
                    >
                      <div className="mb-2 flex items-center gap-2">
                        {category && (
                          <span
                            className="shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold"
                            style={{ backgroundColor: category.bg, color: category.text }}
                          >
                            {category.label}
                          </span>
                        )}
                        <span className="min-w-0 flex-1 truncate text-sm font-bold">
                          {task.title}
                        </span>
                        {task.time && (
                          <span className="shrink-0 text-xs font-semibold text-neutral-500">
                            {task.time}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <ActionButton
                          disabled={isBusy}
                          onClick={() => run(task.id, () => onMove([task.id], todayISO))}
                        >
                          오늘로
                        </ActionButton>
                        <ActionButton
                          disabled={isBusy}
                          onClick={() => run(task.id, () => onMove([task.id], tomorrowISO))}
                        >
                          내일로
                        </ActionButton>
                        <DatePickButton
                          min={todayISO}
                          disabled={isBusy}
                          onPick={(value) => run(task.id, () => onMove([task.id], value))}
                        />
                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() => run(task.id, () => onDelete(task.id))}
                          className="ml-auto px-1.5 py-1 text-xs font-bold text-neutral-400 hover:text-red-500"
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function ActionButton({
  disabled,
  onClick,
  children,
}: {
  disabled: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="rounded-lg border-[1.5px] border-ink bg-[#eee3f5] px-2.5 py-1 text-xs font-bold"
    >
      {children}
    </button>
  );
}

function DatePickButton({
  min,
  disabled,
  onPick,
}: {
  min: string;
  disabled: boolean;
  onPick: (value: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <span className="relative">
      <ActionButton disabled={disabled} onClick={() => inputRef.current?.showPicker()}>
        날짜 선택
      </ActionButton>
      <input
        ref={inputRef}
        type="date"
        min={min}
        tabIndex={-1}
        aria-hidden
        onChange={(e) => e.target.value && onPick(e.target.value)}
        className="pointer-events-none absolute bottom-0 left-0 h-0 w-0 opacity-0"
      />
    </span>
  );
}
