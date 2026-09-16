import { useMemo, useState } from "react";
import type { Task, TaskTag } from "@/types";
import { initialTasks } from "@/data/tasks";
import { addMonths, toISODate } from "@/lib/calendar";

export type FilterKey = "all" | TaskTag;

export function usePlanner() {
  const today = useMemo(() => new Date(), []);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [viewDate, setViewDate] = useState<Date>(today);
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [filter, setFilter] = useState<FilterKey>("all");

  const tasksByDate = useMemo(() => {
    const map = new Map<string, Task[]>();
    for (const task of tasks) {
      const list = map.get(task.date) ?? [];
      list.push(task);
      map.set(task.date, list);
    }
    return map;
  }, [tasks]);

  const selectedISO = toISODate(selectedDate);
  const tasksForSelectedDay = tasksByDate.get(selectedISO) ?? [];
  const visibleTasks =
    filter === "all"
      ? tasksForSelectedDay
      : tasksForSelectedDay.filter((task) => task.tag === filter);

  const doneCount = tasksForSelectedDay.filter((task) => task.done).length;
  const totalCount = tasksForSelectedDay.length;

  function toggleTask(id: string) {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, done: !task.done } : task)),
    );
  }

  function selectDate(date: Date) {
    setSelectedDate(date);
    if (
      date.getMonth() !== viewDate.getMonth() ||
      date.getFullYear() !== viewDate.getFullYear()
    ) {
      setViewDate(date);
    }
  }

  function goToMonth(delta: number) {
    setViewDate((prev) => addMonths(prev, delta));
  }

  return {
    today,
    viewDate,
    selectedDate,
    filter,
    setFilter,
    tasksByDate,
    visibleTasks,
    doneCount,
    totalCount,
    toggleTask,
    selectDate,
    goToMonth,
  };
}
