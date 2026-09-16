import type { FilterKey } from "@/hooks/usePlanner";

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "work", label: "일" },
  { key: "life", label: "개인" },
  { key: "move", label: "운동" },
];

interface FilterTabsProps {
  active: FilterKey;
  onChange: (key: FilterKey) => void;
}

export function FilterTabs({ active, onChange }: FilterTabsProps) {
  return (
    <div className="mb-4 flex gap-2">
      {FILTERS.map(({ key, label }) => (
        <button
          key={key}
          type="button"
          onClick={() => onChange(key)}
          className={`rounded-[10px] border-2 border-ink px-4 py-2 text-[12.5px] font-bold ${
            active === key ? "bg-ink text-white" : "bg-white text-neutral-800"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
