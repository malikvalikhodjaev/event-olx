import type { Metadata } from "next";
import { Suspense } from "react";
import { ProfileSetup } from "@/components/profile-setup";

export const metadata: Metadata = { title: "Настройка профиля" };

export default function OnboardingPage() {
  return <Suspense fallback={<div className="panel" aria-busy="true">Открываем профиль…</div>}><ProfileSetup /></Suspense>;
}
