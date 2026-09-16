import { useState, type FormEvent } from "react";
import type { Task, TaskTag } from "@/types";
import { TASK_TAGS } from "@/lib/taskTags";

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onUpdate: (id: string, patch: { title: string; time: string; tag: TaskTag }) => void;
  onDelete: (id: string) => void;
}

export function TaskItem({ task, onToggle, onUpdate, onDelete }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [time, setTime] = useState(task.time);
  const [tag, setTag] = useState<TaskTag>(task.tag);

  const tagStyle = TASK_TAGS.find((t) => t.key === task.tag)!;

  function startEdit() {
    setTitle(task.title);
    setTime(task.time);
    setTag(task.tag);
    setIsEditing(true);
  }

  function handleSave(e: FormEvent) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    onUpdate(task.id, { title: trimmed, time, tag });
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
        <div className="flex items-center justify-between gap-2">
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="rounded-lg border-2 border-ink px-3 py-2 text-sm font-semibold outline-none"
          />
          <div className="flex gap-1.5">
            {TASK_TAGS.map((opt) => (
              <button
                key={opt.key}
                type="button"
                onClick={() => setTag(opt.key)}
                className={`rounded-md px-2.5 py-1.5 text-[10.5px] font-extrabold tracking-wide ${
                  tag === opt.key ? opt.className : "bg-neutral-100 text-neutral-400"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={!title.trim()}
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
        </div>
        <div className="flex items-center gap-2">
          <span className={`rounded-md px-2 py-0.5 text-[9.5px] font-extrabold tracking-wide ${tagStyle.className}`}>
            {tagStyle.label}
          </span>
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
