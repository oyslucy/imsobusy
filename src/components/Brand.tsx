export function Brand() {
  return (
    <div className="flex items-center justify-between mb-[18px]">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl border-[2.5px] border-ink bg-yellow text-[22px] font-extrabold">
          I
        </div>
        <div>
          <div className="text-[23px] font-extrabold tracking-tight">imsobusy</div>
          <div className="mt-px text-[10.5px] font-bold tracking-[1.5px] text-neutral-400">
            DAILY PLANNER
          </div>
        </div>
      </div>
      <button
        type="button"
        aria-label="검색"
        className="flex h-[42px] w-[42px] items-center justify-center rounded-xl border-[2.5px] border-ink bg-white"
      >
        🔍
      </button>
    </div>
  );
}
