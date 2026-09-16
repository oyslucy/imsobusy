import { useEffect, useState } from "react";

const MIN_O = 1;
const MAX_O = 5;
const STEP_MS = 260;

function useOscillate(min: number, max: number, stepMs: number): number {
  const [value, setValue] = useState(min);

  useEffect(() => {
    let direction = 1;
    const id = setInterval(() => {
      setValue((prev) => {
        const next = prev + direction;
        if (next >= max) {
          direction = -1;
          return max;
        }
        if (next <= min) {
          direction = 1;
          return min;
        }
        return next;
      });
    }, stepMs);
    return () => clearInterval(id);
  }, [min, max, stepMs]);

  return value;
}

export function Brand() {
  const oCount = useOscillate(MIN_O, MAX_O, STEP_MS);
  const wordmark = `ims${"o".repeat(oCount)}busy`;

  return (
    <div className="mb-[18px] flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl border-[2.5px] border-ink bg-yellow text-[22px] font-extrabold">
        I
      </div>
      <div>
        <div className="text-[23px] font-extrabold tracking-tight">{wordmark}</div>
        <div className="mt-px text-[10.5px] font-bold tracking-[1.5px] text-neutral-400">
          DAILY PLANNER
        </div>
      </div>
    </div>
  );
}
