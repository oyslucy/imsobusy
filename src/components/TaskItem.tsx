import { useState, type FormEvent } from "react";
import type { Category, Task } from "@/types";
import { CategoryPicker } from "@/components/CategoryPicker";
import { TimePicker } from "@/components/TimePicker";

interface TaskItemProps {
  task: Task;
  categories: Category[];
  onToggle: (id: string) => void;
  onUpdate: (
    id: string,
    patch: { title: string; location: string; time: string; categoryId: string },
  ) => Promise<void>;
  onDelete: (id: string) => void;
  onCreateCategory: (label: string, swatchIndex: number) => Promise<Category>;
}

export function TaskItem({
  task,
  categories,
  onToggle,
  onUpdate,
  onDelete,
  onCreateCategory,
}: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [location, setLocation] = useState(task.location ?? "");
  const [time, setTime] = useState(task.time);
  const [categoryId, setCategoryId] = useState(task.categoryId);

  const category = categories.find((c) => c.id === task.categoryId);

  function startEdit() {
    setTitle(task.title);
    setLocation(task.location ?? "");
    setTime(task.time);
    setCategoryId(task.categoryId);
    setIsEditing(true);
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed || !categoryId) return;
    await onUpdate(task.id, { title: trimmed, location: location.trim(), time, categoryId });
    setIsEditing(false);
  }

  if (isEditing) {
    return (
      <form
        onSubmit={handleSave}
        className="flex flex-col gap-2.5 rounded-2xl border-2 border-ink bg-white px-4 py-3.5"
      >
        <input
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="rounded-lg border-2 border-ink px-3 py-2 text-sm font-semibold outline-none"
        />
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="위치 (선택)"
          className="rounded-lg border-2 border-ink px-3 py-2 text-sm font-semibold outline-none"
        />
        <div className="flex flex-wrap items-center justify-between gap-2">
          <TimePicker value={time} onChange={setTime} />
          <CategoryPicker
            categories={categories}
            selectedId={categoryId}
            onSelect={setCategoryId}
            onCreateCategory={onCreateCategory}
          />
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={!title.trim() || !categoryId}
            className="flex-1 rounded-lg border-2 border-ink bg-yellow py-2 text-sm font-extrabold disabled:opacity-40"
          >
            저장
          </button>
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="flex-1 rounded-lg border-2 border-ink bg-white py-2 text-sm font-extrabold"
          >
            취소
          </button>
        </div>
      </form>
    );
  }

  return (
    <div
      className={`flex items-center gap-3 rounded-2xl border-2 border-ink bg-white px-4 py-3.5 ${
        task.done ? "opacity-75" : ""
      }`}
    >
      <button
        type="button"
        aria-label={task.done ? "완료 취소" : "완료로 표시"}
        onClick={() => onToggle(task.id)}
        className={`flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-md border-2 border-ink text-xs font-black ${
          task.done ? "bg-yellow" : ""
        }`}
      >
        {task.done ? "✓" : ""}
      </button>
      <div className="min-w-0 flex-1">
        <div
          className={`mb-1.5 truncate text-sm font-bold ${
            task.done ? "text-neutral-400 line-through" : ""
          }`}
        >
          {task.title}
          {task.location && (
            <span className="font-semibold text-neutral-400"> @ {task.location}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {category && (
            <span
              style={{ backgroundColor: category.bg, color: category.text }}
              className="rounded-md px-2 py-0.5 text-[9.5px] font-extrabold tracking-wide"
            >
              {category.label}
            </span>
          )}
          <span className="text-xs font-bold text-neutral-400">{task.time}</span>
        </div>
      </div>
      <div className="flex shrink-0 gap-1.5">
        <button
          type="button"
          aria-label="일정 수정"
          onClick={startEdit}
          className="flex h-7 w-7 items-center justify-center rounded-md border-2 border-ink bg-white text-xs"
        >
          ✏️
        </button>
        <button
          type="button"
          aria-label="일정 취소"
          onClick={() => onDelete(task.id)}
          className="flex h-7 w-7 items-center justify-center rounded-md border-2 border-ink bg-white text-xs text-neutral-500"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
