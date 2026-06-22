"use client";

import { useApp } from "../contexts/AppContext";
import LandingPage from "../components/LandingPage";

export default function HomePage() {
  const { opportunities } = useApp();
  return <LandingPage opportunities={opportunities} />;
}
