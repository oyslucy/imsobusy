import type { Task } from "@/types";

const TAG_STYLES: Record<Task["tag"], { label: string; className: string }> = {
  work: { label: "WORK", className: "bg-lavender text-[#2a2560]" },
  life: { label: "LIFE", className: "bg-coral text-[#3a1000]" },
  move: { label: "MOVE", className: "bg-mint text-[#0a3a2a]" },
};

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
}

export function TaskItem({ task, onToggle }: TaskItemProps) {
  const tag = TAG_STYLES[task.tag];

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
      <div className="flex-1">
        <div
          className={`mb-1.5 text-sm font-bold ${
            task.done ? "text-neutral-400 line-through" : ""
          }`}
        >
          {task.title}
        </div>
        <div className="flex items-center gap-2">
          <span className={`rounded-md px-2 py-0.5 text-[9.5px] font-extrabold tracking-wide ${tag.className}`}>
            {tag.label}
          </span>
          <span className="text-xs font-bold text-neutral-400">{task.time}</span>
        </div>
      </div>
    </div>
  );
}
