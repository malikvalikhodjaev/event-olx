import type { Metadata } from "next";
import { LoginForm } from "@/components/login-form";

export const metadata: Metadata = { title: "Вход" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ role?: string; next?: string }> }) {
  const params = await searchParams;
  return <LoginForm initialRole={params.role} initialNext={params.next} />;
}
