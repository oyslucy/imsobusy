import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
const MINUTES = ["00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"];
const DEFAULT_TIME = "09:00";

interface TimePickerProps {
  value: string | null;
  onChange: (value: string | null) => void;
}

export function TimePicker({ value, onChange }: TimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const hourListRef = useRef<HTMLDivElement>(null);
  const minuteListRef = useRef<HTMLDivElement>(null);

  const [hour, minute] = (value ?? DEFAULT_TIME).split(":");

  useLayoutEffect(() => {
    if (!isOpen || !buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    setPosition({ top: rect.bottom + 6, left: rect.left });
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    function handlePointerDown(e: MouseEvent) {
      const target = e.target as Node;
      if (
        !buttonRef.current?.contains(target) &&
        !panelRef.current?.contains(target)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    hourListRef.current
      ?.querySelector('[data-selected="true"]')
      ?.scrollIntoView({ block: "center" });
    minuteListRef.current
      ?.querySelector('[data-selected="true"]')
      ?.scrollIntoView({ block: "center" });
  }, [isOpen]);

  return (
    <div className="flex items-center gap-1.5">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className={
          value
            ? "rounded-lg border-2 border-ink px-3 py-2 text-sm font-semibold outline-none"
            : "rounded-lg border-2 border-dashed border-ink px-3 py-2 text-sm font-semibold text-neutral-500 outline-none"
        }
      >
        {value ?? "🕐 시간 추가"}
      </button>

      {value && (
        <button
          type="button"
          onClick={() => onChange(null)}
          aria-label="시간 제거"
          className="flex h-7 w-7 items-center justify-center rounded-md border-2 border-ink bg-white text-xs text-neutral-500"
        >
          ✕
        </button>
      )}

      {isOpen &&
        createPortal(
          <div
            ref={panelRef}
            style={{ top: position.top, left: position.left }}
            className="fixed z-50 flex overflow-hidden rounded-lg border-2 border-ink bg-white shadow-lg"
          >
            <div ref={hourListRef} className="max-h-40 overflow-y-auto border-r-2 border-ink">
              {HOURS.map((h) => (
                <button
                  key={h}
                  type="button"
                  data-selected={h === hour}
                  onClick={() => onChange(`${h}:${minute}`)}
                  className={`block w-12 px-3 py-1.5 text-left text-sm font-bold ${
                    h === hour ? "bg-yellow" : "hover:bg-neutral-100"
                  }`}
                >
                  {h}
                </button>
              ))}
            </div>
            <div ref={minuteListRef} className="max-h-40 overflow-y-auto">
              {MINUTES.map((m) => (
                <button
                  key={m}
                  type="button"
                  data-selected={m === minute}
                  onClick={() => onChange(`${hour}:${m}`)}
                  className={`block w-12 px-3 py-1.5 text-left text-sm font-bold ${
                    m === minute ? "bg-yellow" : "hover:bg-neutral-100"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
