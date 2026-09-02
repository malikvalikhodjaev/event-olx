"use client";

import Link from "next/link";
import { useDemoSession } from "@/components/demo-session";

export function HomeFindButton() {
  const { state } = useDemoSession();
  const href = state.signedIn ? "/catalog" : "/login?role=client&next=/catalog";

  return <Link className="button hero-find-button" href={href}>Найти</Link>;
}
