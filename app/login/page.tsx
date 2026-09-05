import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/login-form";

export const metadata: Metadata = { title: "Вход в Маросим" };

export default function LoginPage() {
  return <Suspense fallback={<div className="panel" aria-busy="true">Открываем вход…</div>}><LoginForm /></Suspense>;
}
