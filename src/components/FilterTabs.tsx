import type { Category } from "@/types";
import type { FilterKey } from "@/hooks/usePlanner";

interface FilterTabsProps {
  categories: Category[];
  active: FilterKey;
  onChange: (key: FilterKey) => void;
}

export function FilterTabs({ categories, active, onChange }: FilterTabsProps) {
  return (
    <div className="mb-4 flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onChange("all")}
        className={`rounded-[10px] border-2 border-ink px-4 py-2 text-[12.5px] font-bold ${
          active === "all" ? "bg-ink text-white" : "bg-white text-neutral-800"
        }`}
      >
        전체
      </button>
      {categories.map((cat) => {
        const isActive = active === cat.id;
        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onChange(cat.id)}
            style={isActive ? { backgroundColor: cat.bg, color: cat.text } : undefined}
            className={`rounded-[10px] border-2 border-ink px-4 py-2 text-[12.5px] font-bold ${
              isActive ? "" : "bg-white text-neutral-800"
            }`}
          >
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}
