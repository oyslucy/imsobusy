import { useState, type FormEvent } from "react";

type Mode = "login" | "signup";

interface AuthScreenProps {
  onAuthenticated: () => void;
}

export function AuthScreen({ onAuthenticated }: AuthScreenProps) {
  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  function switchMode(next: Mode) {
    setMode(next);
    setError("");
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("올바른 이메일을 입력해주세요");
      return;
    }
    if (password.length < 8) {
      setError("비밀번호는 8자 이상이어야 해요");
      return;
    }
    if (mode === "signup") {
      if (!name.trim()) {
        setError("이름을 입력해주세요");
        return;
      }
      if (password !== confirmPassword) {
        setError("비밀번호가 일치하지 않아요");
        return;
      }
    }

    setError("");
    onAuthenticated();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#dcdcdc] p-6">
      <div className="w-full max-w-[420px] rounded-card border-[2.5px] border-ink bg-cream p-8 shadow-2xl">
        <div className="mb-7 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border-[2.5px] border-ink bg-yellow text-[22px] font-extrabold">
            I
          </div>
          <div>
            <div className="text-[23px] font-extrabold tracking-tight">imsobusy</div>
            <div className="mt-px text-[10.5px] font-bold tracking-[1.5px] text-neutral-400">
              DAILY PLANNER
            </div>
          </div>
        </div>

        <div className="mb-6 flex overflow-hidden rounded-[10px] border-2 border-ink text-[13px] font-bold">
          <button
            type="button"
            onClick={() => switchMode("login")}
            className={`flex-1 py-2.5 ${mode === "login" ? "bg-ink text-white" : "bg-white text-neutral-700"}`}
          >
            로그인
          </button>
          <button
            type="button"
            onClick={() => switchMode("signup")}
            className={`flex-1 py-2.5 ${mode === "signup" ? "bg-ink text-white" : "bg-white text-neutral-700"}`}
          >
            회원가입
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {mode === "signup" && (
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름"
              className="rounded-lg border-2 border-ink px-3 py-2.5 text-sm font-semibold outline-none"
            />
          )}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일"
            className="rounded-lg border-2 border-ink px-3 py-2.5 text-sm font-semibold outline-none"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호 (8자 이상)"
            className="rounded-lg border-2 border-ink px-3 py-2.5 text-sm font-semibold outline-none"
          />
          {mode === "signup" && (
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="비밀번호 확인"
              className="rounded-lg border-2 border-ink px-3 py-2.5 text-sm font-semibold outline-none"
            />
          )}

          {error && <div className="text-xs font-bold text-coral">{error}</div>}

          <button
            type="submit"
            className="mt-1 rounded-lg border-2 border-ink bg-yellow py-3 text-sm font-extrabold"
          >
            {mode === "login" ? "로그인" : "회원가입"}
          </button>
        </form>

        <div className="mt-5 text-center text-xs font-semibold text-neutral-500">
          {mode === "login" ? (
            <>
              계정이 없으신가요?{" "}
              <button
                type="button"
                onClick={() => switchMode("signup")}
                className="font-extrabold text-[#4a3fa0] underline"
              >
                회원가입
              </button>
            </>
          ) : (
            <>
              이미 계정이 있으신가요?{" "}
              <button
                type="button"
                onClick={() => switchMode("login")}
                className="font-extrabold text-[#4a3fa0] underline"
              >
                로그인
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
