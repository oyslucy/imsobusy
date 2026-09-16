import { useCallback, useEffect, useState } from "react";
import { api, type AuthResponse, type AuthUser, type ProfilePatch } from "@/lib/api";

const TOKEN_KEY = "imsobusy_token";

export type AuthStatus = "loading" | "authed" | "guest";

export function useAuth() {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(TOKEN_KEY),
  );
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  useEffect(() => {
    if (!token) {
      setStatus("guest");
      return;
    }
    let cancelled = false;
    api
      .me(token)
      .then((fetchedUser) => {
        if (cancelled) return;
        setUser(fetchedUser);
        setStatus("authed");
      })
      .catch(() => {
        if (cancelled) return;
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
        setStatus("guest");
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  const applyAuth = useCallback((res: AuthResponse) => {
    localStorage.setItem(TOKEN_KEY, res.access_token);
    setToken(res.access_token);
    setUser(res.user);
    setStatus("authed");
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      applyAuth(await api.login({ email, password }));
    },
    [applyAuth],
  );

  const signup = useCallback(
    async (name: string, email: string, password: string) => {
      applyAuth(await api.signup({ name, email, password }));
    },
    [applyAuth],
  );

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
    setStatus("guest");
  }, []);

  const updateProfile = useCallback(
    async (patch: ProfilePatch) => {
      if (!token) throw new Error("로그인이 필요해요");
      const updated = await api.updateMe(token, patch);
      setUser(updated);
      return updated;
    },
    [token],
  );

  return { status, user, login, signup, logout, updateProfile };
}
