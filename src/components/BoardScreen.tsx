import type { Category } from "@/types";
import { monthLabel } from "@/lib/calendar";

interface CategoryStat {
  category: Category;
  total: number;
  done: number;
}

interface BoardScreenProps {
  viewDate: Date;
  doneCount: number;
  totalCount: number;
  categoryStats: CategoryStat[];
}

export function BoardScreen({ viewDate, doneCount, totalCount, categoryStats }: BoardScreenProps) {
  const { month, year } = monthLabel(viewDate);
  const percent = totalCount === 0 ? 0 : Math.round((doneCount / totalCount) * 100);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="mb-4 text-[22px] font-extrabold">
        {month} {year} 리포트
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto pr-1">
        <div className="rounded-2xl border-[2.5px] border-ink bg-white px-[18px] py-4">
          <div className="mb-2.5 flex justify-between text-[13.5px] font-bold">
            <span>이번 달 완료율</span>
            <span className="text-[15px] text-[#4a3fa0]">
              {doneCount}
              <small className="text-[11px] text-[#9a94c9]">/{totalCount}</small>
            </span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-md border-[1.5px] border-ink bg-[#eee3f5]">
            <div
              className="h-full bg-yellow transition-[width]"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        <div className="rounded-2xl border-[2.5px] border-ink bg-white px-[18px] py-4">
          <div className="mb-3 text-[13.5px] font-bold">카테고리별 분포</div>

          {categoryStats.length === 0 ? (
            <div className="py-4 text-center text-sm font-semibold text-neutral-400">
              이번 달 등록된 일정이 없어요
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {categoryStats.map(({ category, total, done }) => {
                const share = totalCount === 0 ? 0 : Math.round((total / totalCount) * 100);
                return (
                  <div key={category.id}>
                    <div className="mb-1 flex items-center justify-between text-xs font-bold">
                      <span
                        className="rounded-full px-2 py-0.5"
                        style={{ backgroundColor: category.bg, color: category.text }}
                      >
                        {category.label}
                      </span>
                      <span className="text-neutral-500">
                        {done}/{total} · {share}%
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-md border-[1.5px] border-ink bg-[#eee3f5]">
                      <div
                        className="h-full transition-[width]"
                        style={{ width: `${share}%`, backgroundColor: category.bg }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
