import { useState } from "react";
import { AuthScreen } from "@/components/auth/AuthScreen";
import { PlannerApp } from "@/PlannerApp";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return <AuthScreen onAuthenticated={() => setIsAuthenticated(true)} />;
  }

  return <PlannerApp />;
}
