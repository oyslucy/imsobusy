import { useState, type FormEvent } from "react";
import type { TaskTag } from "@/types";
import { TASK_TAGS } from "@/lib/taskTags";

interface AddTaskFormProps {
  onAdd: (input: { title: string; time: string; tag: TaskTag }) => void;
  onCancel: () => void;
}

export function AddTaskForm({ onAdd, onCancel }: AddTaskFormProps) {
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("09:00");
  const [tag, setTag] = useState<TaskTag>("work");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    onAdd({ title: trimmed, time, tag });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-3 flex flex-col gap-2.5 rounded-2xl border-2 border-ink bg-white p-4"
    >
      <input
        autoFocus
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="일정 제목"
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
          추가
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-lg border-2 border-ink bg-white py-2 text-sm font-extrabold"
        >
          취소
        </button>
      </div>
    </form>
  );
}
