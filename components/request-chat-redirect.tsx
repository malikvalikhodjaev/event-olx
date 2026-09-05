"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function RequestChatRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceId = searchParams.get("service") ?? "";

  useEffect(() => {
    router.replace(`/chats${serviceId ? `?service=${encodeURIComponent(serviceId)}` : ""}`);
  }, [router, serviceId]);

  return <div className="panel" aria-busy="true">Открываем сообщения…</div>;
}
