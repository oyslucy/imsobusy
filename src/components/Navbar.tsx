const ICONS = ["🏠", "▦", "🔔", "➤", "👤"];

export function Navbar() {
  return (
    <div className="mt-5 flex items-center justify-around rounded-2xl bg-yellow py-2.5">
      {ICONS.map((icon, i) => (
        <div
          key={icon}
          className={`flex h-[38px] w-[38px] items-center justify-center rounded-[10px] text-base ${
            i === 0 ? "bg-ink text-yellow" : ""
          }`}
        >
          {icon}
        </div>
      ))}
    </div>
  );
}
