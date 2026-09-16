import { AuthScreen } from "@/components/auth/AuthScreen";
import { PlannerApp } from "@/PlannerApp";
import { useAuth } from "@/hooks/useAuth";

export default function App() {
  const { status, user, token, login, signup, logout, updateProfile } = useAuth();

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#dcdcdc] text-sm font-bold text-neutral-500">
        불러오는 중...
      </div>
    );
  }

  if (status === "guest" || !user || !token) {
    return <AuthScreen onLogin={login} onSignup={signup} />;
  }

  return (
    <PlannerApp
      user={user}
      token={token}
      onLogout={logout}
      onUpdateProfile={updateProfile}
    />
  );
}
