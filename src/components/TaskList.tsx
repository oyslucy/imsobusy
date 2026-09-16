import type { Category, Task } from "@/types";
import { TaskItem } from "@/components/TaskItem";

interface TaskListProps {
  tasks: Task[];
  categories: Category[];
  onToggle: (id: string) => void;
  onUpdate: (
    id: string,
    patch: { title: string; location: string; time: string; categoryId: string },
  ) => Promise<void>;
  onDelete: (id: string) => void;
  onCreateCategory: (label: string, swatchIndex: number) => Promise<Category>;
}

export function TaskList({
  tasks,
  categories,
  onToggle,
  onUpdate,
  onDelete,
  onCreateCategory,
}: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center text-sm font-semibold text-neutral-400">
        이 날은 등록된 일정이 없어요
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          categories={categories}
          onToggle={onToggle}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onCreateCategory={onCreateCategory}
        />
      ))}
    </div>
  );
}
