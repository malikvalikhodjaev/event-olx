import type { Metadata } from "next";
import { ProfileSetup } from "@/components/profile-setup";

export const metadata: Metadata = { title: "Настройка профиля" };

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ intent?: string; next?: string }>;
}) {
  const params = await searchParams;
  return <ProfileSetup initialIntent={params.intent} initialNext={params.next} />;
}
