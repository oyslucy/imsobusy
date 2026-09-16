import { useState, type FormEvent } from "react";
import type { Category } from "@/types";
import { CategoryPicker } from "@/components/CategoryPicker";
import { TimePicker } from "@/components/TimePicker";

interface AddTaskFormProps {
  categories: Category[];
  onAdd: (input: {
    title: string;
    location: string;
    time: string;
    categoryId: string;
  }) => Promise<void>;
  onCreateCategory: (label: string, swatchIndex: number) => Promise<Category>;
  onCancel: () => void;
}

export function AddTaskForm({
  categories,
  onAdd,
  onCreateCategory,
  onCancel,
}: AddTaskFormProps) {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [time, setTime] = useState("09:00");
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed || !categoryId) return;
    setIsSubmitting(true);
    try {
      await onAdd({ title: trimmed, location: location.trim(), time, categoryId });
    } finally {
      setIsSubmitting(false);
    }
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
          disabled={!title.trim() || !categoryId || isSubmitting}
          className="flex-1 rounded-lg border-2 border-ink bg-yellow py-2 text-sm font-extrabold disabled:opacity-40"
        >
          {isSubmitting ? "추가 중..." : "추가"}
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
