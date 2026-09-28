import { useState } from "react";
import type { Task } from "@/types";
import type { ApiFriend } from "@/lib/api";
import { ApiError } from "@/lib/api";

interface SendTaskDialogProps {
  task: Task;
  friends: ApiFriend[];
  onSend: (taskId: string, recipientId: string) => Promise<void>;
  onClose: () => void;
}

export function SendTaskDialog({ task, friends, onSend, onClose }: SendTaskDialogProps) {
  const [sentIds, setSentIds] = useState<Set<string>>(new Set());
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSend(friendId: string) {
    setBusyId(friendId);
    setError(null);
    try {
      await onSend(task.id, friendId);
      setSentIds((prev) => new Set(prev).add(friendId));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "일정을 보내지 못했어요");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[360px] rounded-2xl border-[2.5px] border-ink bg-cream p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-1 text-[18px] font-extrabold">➤ 친구에게 보내기</div>
        <div className="mb-4 truncate text-[12px] font-semibold text-neutral-500">
          {task.date} {task.time ?? ""} · {task.title}
        </div>

        {friends.length === 0 ? (
          <div className="py-6 text-center text-sm font-semibold text-neutral-400">
            아직 친구가 없어요
            <br />
            🔔 탭에서 친구를 추가해보세요
          </div>
        ) : (
          <div className="flex max-h-[280px] flex-col gap-2 overflow-y-auto pr-1">
            {friends.map((friend) => {
              const isSent = sentIds.has(friend.id);
              return (
                <div
                  key={friend.id}
                  className="flex items-center gap-2.5 rounded-xl border-2 border-ink bg-white px-3 py-2"
                >
                  <span className="text-lg">{friend.avatar_emoji}</span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-bold">{friend.name}</div>
                    <div className="truncate text-[11px] font-semibold text-neutral-400">
                      {friend.email}
                    </div>
                  </div>
                  <button
                    type="button"
                    disabled={isSent || busyId !== null}
                    onClick={() => handleSend(friend.id)}
                    className={`shrink-0 rounded-lg border-[1.5px] border-ink px-2.5 py-1 text-xs font-bold ${
                      isSent ? "bg-white text-neutral-400" : "bg-yellow"
                    }`}
                  >
                    {isSent ? "보냄 ✓" : busyId === friend.id ? "..." : "보내기"}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {error && <div className="mt-3 text-xs font-bold text-red-500">{error}</div>}

        <button
          type="button"
          onClick={onClose}
          className="mt-4 w-full rounded-lg border-2 border-ink bg-white py-2 text-sm font-extrabold"
        >
          닫기
        </button>
      </div>
    </div>
  );
}
