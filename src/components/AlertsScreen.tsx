import { useState, type FormEvent, type ReactNode } from "react";
import type { Category } from "@/types";
import type { ApiFriend, ApiFriendRequest, ApiSharedTask } from "@/lib/api";
import { ApiError } from "@/lib/api";
import { CategoryPicker } from "@/components/CategoryPicker";

interface AlertsScreenProps {
  friends: ApiFriend[];
  requests: ApiFriendRequest[];
  inbox: ApiSharedTask[];
  categories: Category[];
  onSendRequest: (email: string) => Promise<void>;
  onAcceptRequest: (id: string) => Promise<void>;
  onDeclineRequest: (id: string) => Promise<void>;
  onRemoveFriend: (friendId: string) => Promise<void>;
  onAcceptShared: (id: string, categoryId: string) => Promise<void>;
  onDeclineShared: (id: string) => Promise<void>;
  onCreateCategory: (label: string, swatchIndex: number) => Promise<Category>;
}

function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("ko-KR", {
    month: "long",
    day: "numeric",
    weekday: "short",
  });
}

export function AlertsScreen({
  friends,
  requests,
  inbox,
  categories,
  onSendRequest,
  onAcceptRequest,
  onDeclineRequest,
  onRemoveFriend,
  onAcceptShared,
  onDeclineShared,
  onCreateCategory,
}: AlertsScreenProps) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(
    null,
  );
  const [busyId, setBusyId] = useState<string | null>(null);

  async function run(id: string, action: () => Promise<void>) {
    setBusyId(id);
    setMessage(null);
    try {
      await action();
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof ApiError ? err.message : "요청에 실패했어요",
      });
    } finally {
      setBusyId(null);
    }
  }

  async function handleAddFriend(e: FormEvent) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;
    await run("add", async () => {
      await onSendRequest(trimmed);
      setEmail("");
      setMessage({ type: "success", text: "친구 요청을 보냈어요" });
    });
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="mb-4 text-[22px] font-extrabold">알림</div>

      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto pr-1">
        <Section title="받은 일정" count={inbox.length}>
          {inbox.length === 0 ? (
            <Empty>받은 일정이 없어요</Empty>
          ) : (
            <div className="flex flex-col gap-2">
              {inbox.map((item) => (
                <SharedTaskCard
                  key={item.id}
                  item={item}
                  categories={categories}
                  disabled={busyId !== null}
                  onAccept={(categoryId) => run(item.id, () => onAcceptShared(item.id, categoryId))}
                  onDecline={() => run(item.id, () => onDeclineShared(item.id))}
                  onCreateCategory={onCreateCategory}
                />
              ))}
            </div>
          )}
        </Section>

        {requests.length > 0 && (
          <Section title="친구 요청" count={requests.length}>
            <div className="flex flex-col gap-2">
              {requests.map((req) => (
                <FriendRow key={req.id} friend={req.requester}>
                  <SmallButton
                    primary
                    disabled={busyId !== null}
                    onClick={() => run(req.id, () => onAcceptRequest(req.id))}
                  >
                    수락
                  </SmallButton>
                  <SmallButton
                    disabled={busyId !== null}
                    onClick={() => run(req.id, () => onDeclineRequest(req.id))}
                  >
                    거절
                  </SmallButton>
                </FriendRow>
              ))}
            </div>
          </Section>
        )}

        <Section title="친구" count={friends.length}>
          <form onSubmit={handleAddFriend} className="mb-3 flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="친구 이메일"
              className="min-w-0 flex-1 rounded-lg border-2 border-ink px-3 py-2 text-sm font-semibold outline-none"
            />
            <button
              type="submit"
              disabled={!email.trim() || busyId !== null}
              className="shrink-0 rounded-lg border-2 border-ink bg-yellow px-3 text-sm font-extrabold disabled:opacity-40"
            >
              요청
            </button>
          </form>
          {message && (
            <div
              className={`mb-2 text-xs font-bold ${
                message.type === "success" ? "text-[#4a3fa0]" : "text-red-500"
              }`}
            >
              {message.text}
            </div>
          )}
          {friends.length === 0 ? (
            <Empty>이메일로 친구를 추가해보세요</Empty>
          ) : (
            <div className="flex flex-col gap-2">
              {friends.map((friend) => (
                <FriendRow key={friend.id} friend={friend}>
                  <button
                    type="button"
                    disabled={busyId !== null}
                    onClick={() => {
                      if (window.confirm(`${friend.name}님을 친구에서 삭제할까요?`)) {
                        run(friend.id, () => onRemoveFriend(friend.id));
                      }
                    }}
                    className="px-1.5 py-1 text-xs font-bold text-neutral-400 hover:text-red-500"
                  >
                    삭제
                  </button>
                </FriendRow>
              ))}
            </div>
          )}
        </Section>
      </div>
    </div>
  );
}

function SharedTaskCard({
  item,
  categories,
  disabled,
  onAccept,
  onDecline,
  onCreateCategory,
}: {
  item: ApiSharedTask;
  categories: Category[];
  disabled: boolean;
  onAccept: (categoryId: string) => void;
  onDecline: () => void;
  onCreateCategory: (label: string, swatchIndex: number) => Promise<Category>;
}) {
  const [isPicking, setIsPicking] = useState(false);
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? "");

  return (
    <div className="rounded-xl border-2 border-ink px-3 py-2.5">
      <div className="mb-0.5 text-[11px] font-bold text-[#8a83b8]">
        {item.sender.avatar_emoji} {item.sender.name}님이 보냈어요
      </div>
      <div className="truncate text-sm font-bold">
        {item.title}
        {item.location && (
          <span className="font-semibold text-neutral-400"> @ {item.location}</span>
        )}
      </div>
      <div className="mb-2 text-xs font-semibold text-neutral-500">
        {formatDate(item.date)}
        {item.time && ` ${item.time}`}
      </div>

      {isPicking ? (
        <div className="flex flex-col gap-2">
          <div className="text-[11px] font-bold text-neutral-500">어떤 카테고리로 추가할까요?</div>
          <CategoryPicker
            categories={categories}
            selectedId={categoryId}
            onSelect={setCategoryId}
            onCreateCategory={onCreateCategory}
          />
          <div className="flex gap-1.5">
            <SmallButton primary disabled={disabled || !categoryId} onClick={() => onAccept(categoryId)}>
              추가하기
            </SmallButton>
            <SmallButton disabled={disabled} onClick={() => setIsPicking(false)}>
              취소
            </SmallButton>
          </div>
        </div>
      ) : (
        <div className="flex gap-1.5">
          <SmallButton primary disabled={disabled} onClick={() => setIsPicking(true)}>
            수락
          </SmallButton>
          <SmallButton disabled={disabled} onClick={onDecline}>
            거절
          </SmallButton>
        </div>
      )}
    </div>
  );
}

function Section({ title, count, children }: { title: string; count: number; children: ReactNode }) {
  return (
    <div className="rounded-2xl border-[2.5px] border-ink bg-white px-[18px] py-4">
      <div className="mb-3 flex justify-between text-[13.5px] font-bold">
        <span>{title}</span>
        <span className="text-[#4a3fa0]">{count}</span>
      </div>
      {children}
    </div>
  );
}

function FriendRow({ friend, children }: { friend: ApiFriend; children: ReactNode }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="text-lg">{friend.avatar_emoji}</span>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-bold">{friend.name}</div>
        <div className="truncate text-[11px] font-semibold text-neutral-400">{friend.email}</div>
      </div>
      <div className="flex shrink-0 gap-1.5">{children}</div>
    </div>
  );
}

function SmallButton({
  primary,
  disabled,
  onClick,
  children,
}: {
  primary?: boolean;
  disabled: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`rounded-lg border-[1.5px] border-ink px-2.5 py-1 text-xs font-bold disabled:opacity-50 ${
        primary ? "bg-yellow" : "bg-white"
      }`}
    >
      {children}
    </button>
  );
}

function Empty({ children }: { children: ReactNode }) {
  return <div className="py-3 text-center text-sm font-semibold text-neutral-400">{children}</div>;
}
