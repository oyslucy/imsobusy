import { useMemo, useState } from "react";
import type { Category, Task } from "@/types";
import { initialTasks } from "@/data/tasks";
import { addMonths, toISODate } from "@/lib/calendar";
import { CATEGORY_PALETTE, DEFAULT_CATEGORIES } from "@/lib/categories";

export type FilterKey = "all" | string;

export function usePlanner() {
  const today = useMemo(() => new Date(), []);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
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
      : tasksForSelectedDay.filter((task) => task.categoryId === filter);

  const doneCount = tasksForSelectedDay.filter((task) => task.done).length;
  const totalCount = tasksForSelectedDay.length;

  function toggleTask(id: string) {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, done: !task.done } : task)),
    );
  }

  function addTask(input: { title: string; time: string; categoryId: string }) {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title: input.title,
      time: input.time,
      categoryId: input.categoryId,
      done: false,
      date: selectedISO,
    };
    setTasks((prev) => [...prev, newTask]);
  }

  function updateTask(
    id: string,
    patch: { title: string; time: string; categoryId: string },
  ) {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, ...patch } : task)),
    );
  }

  function deleteTask(id: string) {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }

  function addCategory(label: string, swatchIndex: number): Category {
    const swatch = CATEGORY_PALETTE[swatchIndex % CATEGORY_PALETTE.length];
    const newCategory: Category = {
      id: crypto.randomUUID(),
      label,
      bg: swatch.bg,
      text: swatch.text,
    };
    setCategories((prev) => [...prev, newCategory]);
    return newCategory;
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
    categories,
    tasksByDate,
    visibleTasks,
    doneCount,
    totalCount,
    toggleTask,
    addTask,
    updateTask,
    deleteTask,
    addCategory,
    selectDate,
    goToMonth,
  };
}
