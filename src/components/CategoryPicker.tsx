import { useState } from "react";
import type { Category } from "@/types";
import { CATEGORY_PALETTE } from "@/lib/categories";

interface CategoryPickerProps {
  categories: Category[];
  selectedId: string;
  onSelect: (id: string) => void;
  onCreateCategory: (label: string, swatchIndex: number) => Category;
}

export function CategoryPicker({
  categories,
  selectedId,
  onSelect,
  onCreateCategory,
}: CategoryPickerProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [label, setLabel] = useState("");
  const [swatchIndex, setSwatchIndex] = useState(0);

  function handleCreate() {
    const trimmed = label.trim();
    if (!trimmed) return;
    const created = onCreateCategory(trimmed.toUpperCase(), swatchIndex);
    onSelect(created.id);
    setLabel("");
    setSwatchIndex(0);
    setIsCreating(false);
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {categories.map((cat) => {
        const isSelected = selectedId === cat.id;
        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelect(cat.id)}
            style={isSelected ? { backgroundColor: cat.bg, color: cat.text } : undefined}
            className={`rounded-md px-2.5 py-1.5 text-[10.5px] font-extrabold tracking-wide ${
              isSelected ? "" : "bg-neutral-100 text-neutral-400"
            }`}
          >
            {cat.label}
          </button>
        );
      })}

      {isCreating ? (
        <div className="flex items-center gap-1.5 rounded-md border-2 border-ink bg-white px-2 py-1">
          <input
            autoFocus
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="이름"
            className="w-16 text-[11px] font-bold outline-none"
          />
          <div className="flex gap-1">
            {CATEGORY_PALETTE.map((swatch, i) => (
              <button
                key={i}
                type="button"
                aria-label={`색상 ${i + 1}`}
                onClick={() => setSwatchIndex(i)}
                style={{ backgroundColor: swatch.bg }}
                className={`h-4 w-4 rounded-full border-2 ${
                  swatchIndex === i ? "border-ink" : "border-transparent"
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={handleCreate}
            disabled={!label.trim()}
            aria-label="카테고리 생성"
            className="text-[13px] font-extrabold disabled:opacity-30"
          >
            ✓
          </button>
          <button
            type="button"
            onClick={() => setIsCreating(false)}
            aria-label="카테고리 생성 취소"
            className="text-[13px] font-extrabold text-neutral-400"
          >
            ✕
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsCreating(true)}
          aria-label="카테고리 추가"
          className="flex h-[26px] w-[26px] items-center justify-center rounded-md border-2 border-dashed border-ink text-xs font-extrabold text-neutral-500"
        >
          +
        </button>
      )}
    </div>
  );
}
