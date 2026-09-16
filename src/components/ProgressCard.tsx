interface ProgressCardProps {
  done: number;
  total: number;
}

export function ProgressCard({ done, total }: ProgressCardProps) {
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);

  return (
    <div className="mb-[18px] rounded-2xl border-[2.5px] border-ink bg-white px-[18px] py-4">
      <div className="mb-2.5 flex justify-between text-[13.5px] font-bold">
        <span>오늘의 진행률</span>
        <span className="text-[15px] text-[#4a3fa0]">
          {done}
          <small className="text-[11px] text-[#9a94c9]">/{total}</small>
        </span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-md border-[1.5px] border-ink bg-[#eee3f5]">
        <div
          className="h-full bg-yellow transition-[width]"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
