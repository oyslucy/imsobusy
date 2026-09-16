import { useState, type FormEvent } from "react";
import type { AuthUser, ProfilePatch } from "@/lib/api";
import { ApiError } from "@/lib/api";

const AVATAR_OPTIONS = ["🙂", "🐱", "🐶", "🌟", "🍀", "🔥", "🎧", "📚"];

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
          {AVATAR_OPTIONS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => setAvatarEmoji(emoji)}
              aria-label={`아바타 ${emoji}`}
              className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-lg ${
                avatarEmoji === emoji ? "border-ink bg-yellow" : "border-transparent bg-white"
              }`}
            >
              {emoji}
            </button>
          ))}
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
