import type { Task } from "@/types";
import { TaskItem } from "@/components/TaskItem";

interface TaskListProps {
  tasks: Task[];
  onToggle: (id: string) => void;
}

export function TaskList({ tasks, onToggle }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center text-sm font-semibold text-neutral-400">
        이 날은 등록된 일정이 없어요
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-2.5 overflow-auto">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} onToggle={onToggle} />
      ))}
    </div>
  );
}
