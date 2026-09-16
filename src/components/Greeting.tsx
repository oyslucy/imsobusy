interface GreetingProps {
  name: string;
  remaining: number;
}

export function Greeting({ name, remaining }: GreetingProps) {
  return (
    <div className="mb-[22px] flex items-center justify-between rounded-2xl border-[2.5px] border-ink bg-yellow px-[22px] py-[18px]">
      <div>
        <p className="m-0 mb-1.5 text-[21px] font-extrabold">좋은 아침, {name}!</p>
        <div className="text-[13px] font-semibold text-[#3a3200]">
          오늘{" "}
          <span className="rounded-md bg-ink px-2 py-0.5 font-extrabold text-yellow">
            {remaining}개
          </span>{" "}
          의 일정이 남아있어요
        </div>
      </div>
    </div>
  );
}
