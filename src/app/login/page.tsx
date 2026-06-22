"use client";

import { useApp } from "../../contexts/AppContext";
import AuthScreen from "../../components/AuthScreen";

export default function LoginPage() {
  const { handleAuthSuccess } = useApp();
  return <AuthScreen onAuthSuccess={handleAuthSuccess} />;
}
