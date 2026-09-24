import { useState, type DragEvent } from "react";
import type { Category, Task } from "@/types";
import { TaskItem } from "@/components/TaskItem";

interface TaskListProps {
  tasks: Task[];
  allTasks: Task[];
  categories: Category[];
  onToggle: (id: string) => void;
  onUpdate: (
    id: string,
    patch: { title: string; location: string; time: string | null; categoryId: string },
  ) => Promise<void>;
  onDelete: (id: string) => void;
  onCreateCategory: (label: string, swatchIndex: number) => Promise<Category>;
  onReorder?: (orderedIds: string[]) => void;
  canReorder?: boolean;
}

export function TaskList({
  tasks,
  allTasks,
  categories,
  onToggle,
  onUpdate,
  onDelete,
  onCreateCategory,
  onReorder,
  canReorder,
}: TaskListProps) {
  const [dragId, setDragId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);

  if (tasks.length === 0) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center text-sm font-semibold text-neutral-400">
        이 날은 등록된 일정이 없어요
      </div>
    );
  }

  function handleDrop(e: DragEvent<HTMLDivElement>, targetId: string) {
    e.preventDefault();
    if (!dragId || dragId === targetId || !onReorder) {
      setDragId(null);
      setOverId(null);
      return;
    }
    const ids = allTasks.map((t) => t.id);
    const from = ids.indexOf(dragId);
    const to = ids.indexOf(targetId);
    ids.splice(from, 1);
    ids.splice(to, 0, dragId);
    onReorder(ids);
    setDragId(null);
    setOverId(null);
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-1.5 overflow-y-auto">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          categories={categories}
          onToggle={onToggle}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onCreateCategory={onCreateCategory}
          draggable={canReorder}
          isDragging={dragId === task.id}
          isDragOver={overId === task.id && dragId !== null && dragId !== task.id}
          onDragStart={() => setDragId(task.id)}
          onDragOver={(e) => {
            e.preventDefault();
            if (overId !== task.id) setOverId(task.id);
          }}
          onDrop={(e) => handleDrop(e, task.id)}
          onDragEnd={() => {
            setDragId(null);
            setOverId(null);
          }}
        />
      ))}
    </div>
  );
}
