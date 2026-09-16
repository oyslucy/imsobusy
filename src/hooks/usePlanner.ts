import { useEffect, useMemo, useState } from "react";
import type { Category, Task } from "@/types";
import { addMonths, toISODate } from "@/lib/calendar";
import { CATEGORY_PALETTE } from "@/lib/categories";
import { api, type ApiCategory, type ApiTask } from "@/lib/api";

export type FilterKey = "all" | string;

function mapCategory(cat: ApiCategory): Category {
  return { id: cat.id, label: cat.label, bg: cat.bg, text: cat.text };
}

function mapTask(task: ApiTask): Task {
  return {
    id: task.id,
    title: task.title,
    time: task.time,
    categoryId: task.category_id,
    done: task.done,
    date: task.date,
  };
}

export function usePlanner(token: string) {
  const today = useMemo(() => new Date(), []);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewDate, setViewDate] = useState<Date>(today);
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [filter, setFilter] = useState<FilterKey>("all");

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    Promise.all([api.listCategories(token), api.listTasks(token)])
      .then(([apiCategories, apiTasks]) => {
        if (cancelled) return;
        setCategories(apiCategories.map(mapCategory));
        setTasks(apiTasks.map(mapTask));
      })
      .catch((err) => {
        console.error("플래너 데이터를 불러오지 못했어요", err);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

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

  async function toggleTask(id: string) {
    const target = tasks.find((task) => task.id === id);
    if (!target) return;
    const updated = await api.updateTask(token, id, { done: !target.done });
    setTasks((prev) => prev.map((task) => (task.id === id ? mapTask(updated) : task)));
  }

  async function addTask(input: { title: string; time: string; categoryId: string }) {
    const created = await api.createTask(token, {
      title: input.title,
      time: input.time,
      category_id: input.categoryId,
      date: selectedISO,
    });
    setTasks((prev) => [...prev, mapTask(created)]);
  }

  async function updateTask(
    id: string,
    patch: { title: string; time: string; categoryId: string },
  ) {
    const updated = await api.updateTask(token, id, {
      title: patch.title,
      time: patch.time,
      category_id: patch.categoryId,
    });
    setTasks((prev) => prev.map((task) => (task.id === id ? mapTask(updated) : task)));
  }

  async function deleteTask(id: string) {
    await api.deleteTask(token, id);
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }

  async function addCategory(label: string, swatchIndex: number): Promise<Category> {
    const swatch = CATEGORY_PALETTE[swatchIndex % CATEGORY_PALETTE.length];
    const created = await api.createCategory(token, {
      label,
      bg: swatch.bg,
      text: swatch.text,
    });
    const newCategory = mapCategory(created);
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
    isLoading,
    toggleTask,
    addTask,
    updateTask,
    deleteTask,
    addCategory,
    selectDate,
    goToMonth,
  };
}
