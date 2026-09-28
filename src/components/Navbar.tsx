export type NavView = "home" | "board" | "alerts" | "carry" | "profile";

const NAV_ITEMS: { key: NavView; icon: string }[] = [
  { key: "home", icon: "🏠" },
  { key: "board", icon: "▦" },
  { key: "alerts", icon: "🔔" },
  { key: "carry", icon: "➤" },
  { key: "profile", icon: "👤" },
];

interface NavbarProps {
  active: NavView;
  onNavigate: (view: NavView) => void;
  badges?: Partial<Record<NavView, number>>;
}

export function Navbar({ active, onNavigate, badges }: NavbarProps) {
  return (
    <div className="mt-5 flex items-center justify-around rounded-2xl bg-yellow py-2.5">
      {NAV_ITEMS.map((item) => {
        const isActive = item.key === active;
        const badge = badges?.[item.key] ?? 0;
        return (
          <button
            key={item.key}
            type="button"
            aria-label={item.key}
            onClick={() => onNavigate(item.key)}
            className={`relative flex h-[38px] w-[38px] items-center justify-center rounded-[10px] text-base ${
              isActive ? "bg-ink text-yellow" : ""
            }`}
          >
            {item.icon}
            {badge > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full border-[1.5px] border-ink bg-[#ff6b6b] px-1 text-[9px] font-extrabold leading-none text-white">
                {badge > 9 ? "9+" : badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
