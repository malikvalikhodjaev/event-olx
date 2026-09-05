import { Suspense } from "react";
import { RequestChatRedirect } from "@/components/request-chat-redirect";

export default function NewRequestPage() {
  return <Suspense fallback={<div className="panel" aria-busy="true">Открываем сообщения…</div>}><RequestChatRedirect /></Suspense>;
}
