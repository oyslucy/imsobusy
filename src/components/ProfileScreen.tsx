import { useState, type FormEvent } from "react";
import type { AuthUser, ProfilePatch } from "@/lib/api";
import { ApiError } from "@/lib/api";

const AVATAR_OPTIONS = ["🙂", "🐱", "🐶", "🌟", "🍀", "🔥", "🎧", "📚"];

const MORE_EMOJIS = [
  "😎", "🥳", "😺", "🐰", "🐻", "🐼", "🦊", "🐸",
  "🐥", "🦄", "🐳", "🌈", "🌸", "🌻", "🍓", "🍑",
  "🍩", "☕", "🍺", "⚽", "🏀", "🎮", "🎨", "🎸",
  "✈️", "🚀", "💎", "💡", "💪", "👍", "❤️", "💯",
  "✅", "⭐", "🎉", "🏆", "📌", "✨", "🌙", "☀️",
];

/** Returns the first emoji in the text, or null when it doesn't start with one. */
function firstEmoji(text: string): string | null {
  const segmenter = new Intl.Segmenter(undefined, { granularity: "grapheme" });
  const first = segmenter.segment(text.trim())[Symbol.iterator]().next().value?.segment;
  return first && /\p{Extended_Pictographic}|\p{Regional_Indicator}/u.test(first) ? first : null;
}

interface ProfileScreenProps {
  user: AuthUser;
  onUpdate: (patch: ProfilePatch) => Promise<AuthUser>;
  onLogout: () => void;
}

export function ProfileScreen({ user, onUpdate, onLogout }: ProfileScreenProps) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [bio, setBio] = useState(user.bio ?? "");
  const [avatarEmoji, setAvatarEmoji] = useState(user.avatar_emoji);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(
    null,
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isPickingMore, setIsPickingMore] = useState(false);
  const [customEmoji, setCustomEmoji] = useState("");

  const avatarChoices = AVATAR_OPTIONS.includes(avatarEmoji)
    ? AVATAR_OPTIONS
    : [...AVATAR_OPTIONS, avatarEmoji];

  function pickEmoji(emoji: string) {
    setAvatarEmoji(emoji);
    setIsPickingMore(false);
    setCustomEmoji("");
  }

  function handleCustomEmoji() {
    const emoji = firstEmoji(customEmoji);
    if (!emoji) {
      setMessage({ type: "error", text: "이모티콘 하나를 입력해주세요" });
      return;
    }
    setMessage(null);
    pickEmoji(emoji);
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    setMessage(null);

    const patch: ProfilePatch = {
      name: name.trim(),
      email: email.trim(),
      bio: bio.trim(),
      avatar_emoji: avatarEmoji,
    };

    if (newPassword || currentPassword) {
      if (!currentPassword) {
        setMessage({ type: "error", text: "현재 비밀번호를 입력해주세요" });
        return;
      }
      if (newPassword.length < 8) {
        setMessage({ type: "error", text: "새 비밀번호는 8자 이상이어야 해요" });
        return;
      }
      patch.current_password = currentPassword;
      patch.new_password = newPassword;
    }

    setIsSaving(true);
    try {
      await onUpdate(patch);
      setMessage({ type: "success", text: "저장했어요" });
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof ApiError ? err.message : "저장에 실패했어요",
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="mb-4 text-[22px] font-extrabold">내 정보</div>

      <form
        onSubmit={handleSave}
        className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto pr-1"
      >
        <div className="flex flex-wrap justify-center gap-1.5">
          {avatarChoices.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => pickEmoji(emoji)}
              aria-label={`아바타 ${emoji}`}
              className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-lg ${
                avatarEmoji === emoji ? "border-ink bg-yellow" : "border-transparent bg-white"
              }`}
            >
              {emoji}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setIsPickingMore((prev) => !prev)}
            aria-label="다른 이모티콘 선택"
            className={`flex h-10 w-10 items-center justify-center rounded-full border-2 border-dashed border-ink text-lg font-bold ${
              isPickingMore ? "bg-yellow" : "bg-white"
            }`}
          >
            +
          </button>
        </div>

        {isPickingMore && (
          <div className="rounded-2xl border-2 border-ink bg-white p-3">
            <div className="mb-2 grid grid-cols-8 gap-1">
              {MORE_EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => pickEmoji(emoji)}
                  aria-label={`아바타 ${emoji}`}
                  className={`flex aspect-square items-center justify-center rounded-lg text-lg hover:bg-[#eee3f5] ${
                    avatarEmoji === emoji ? "bg-yellow" : ""
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={customEmoji}
                onChange={(e) => setCustomEmoji(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleCustomEmoji();
                  }
                }}
                placeholder="직접 입력 (예: 🦖)"
                className="min-w-0 flex-1 rounded-lg border-2 border-ink px-3 py-1.5 text-sm font-semibold outline-none"
              />
              <button
                type="button"
                onClick={handleCustomEmoji}
                disabled={!customEmoji.trim()}
                className="shrink-0 rounded-lg border-2 border-ink bg-yellow px-3 text-sm font-extrabold disabled:opacity-40"
              >
                선택
              </button>
            </div>
          </div>
        )}

        <div className="text-center text-[11px] font-semibold text-neutral-400">
          고른 이모티콘은 할 일을 완료했을 때 체크 대신 표시돼요
        </div>

        <label className="text-xs font-bold text-neutral-500">이름</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded-lg border-2 border-ink px-3 py-2 text-sm font-semibold outline-none"
        />

        <label className="text-xs font-bold text-neutral-500">이메일</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-lg border-2 border-ink px-3 py-2 text-sm font-semibold outline-none"
        />

        <label className="text-xs font-bold text-neutral-500">한 줄 소개</label>
        <input
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="오늘의 한마디"
          className="rounded-lg border-2 border-ink px-3 py-2 text-sm font-semibold outline-none"
        />

        <div className="mt-2 border-t-2 border-dashed border-ink/30 pt-3">
          <div className="mb-2 text-xs font-bold text-neutral-500">비밀번호 변경 (선택)</div>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="현재 비밀번호"
            className="mb-2 w-full rounded-lg border-2 border-ink px-3 py-2 text-sm font-semibold outline-none"
          />
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="새 비밀번호 (8자 이상)"
            className="w-full rounded-lg border-2 border-ink px-3 py-2 text-sm font-semibold outline-none"
          />
        </div>

        {message && (
          <div
            className={`text-xs font-bold ${
              message.type === "success" ? "text-[#0a3a2a]" : "text-coral"
            }`}
          >
            {message.text}
          </div>
        )}

        <button
          type="submit"
          disabled={isSaving}
          className="mt-1 rounded-lg border-2 border-ink bg-yellow py-2.5 text-sm font-extrabold disabled:opacity-50"
        >
          {isSaving ? "저장 중..." : "저장하기"}
        </button>
        <button
          type="button"
          onClick={onLogout}
          className="rounded-lg border-2 border-ink bg-white py-2.5 text-sm font-extrabold text-neutral-600"
        >
          로그아웃
        </button>
      </form>
    </div>
  );
}
