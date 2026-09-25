export type NavView = "home" | "board" | "profile";

const NAV_ITEMS: { key: NavView | "alerts" | "send"; icon: string }[] = [
  { key: "home", icon: "🏠" },
  { key: "board", icon: "▦" },
  { key: "alerts", icon: "🔔" },
  { key: "send", icon: "➤" },
  { key: "profile", icon: "👤" },
];

function isNavView(key: string): key is NavView {
  return key === "home" || key === "board" || key === "profile";
}

interface NavbarProps {
  active: NavView;
  onNavigate: (view: NavView) => void;
}

export function Navbar({ active, onNavigate }: NavbarProps) {
  return (
    <div className="mt-5 flex items-center justify-around rounded-2xl bg-yellow py-2.5">
      {NAV_ITEMS.map((item) => {
        const isNavigable = isNavView(item.key);
        const isActive = isNavigable && item.key === active;
        return (
          <button
            key={item.key}
            type="button"
            disabled={!isNavigable}
            aria-label={item.key}
            onClick={() => isNavView(item.key) && onNavigate(item.key)}
            className={`flex h-[38px] w-[38px] items-center justify-center rounded-[10px] text-base ${
              isActive ? "bg-ink text-yellow" : ""
            } ${isNavigable ? "" : "cursor-default opacity-70"}`}
          >
            {item.icon}
          </button>
        );
      })}
    </div>
  );
}
