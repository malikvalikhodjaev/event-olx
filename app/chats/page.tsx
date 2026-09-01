import type { Metadata } from "next";
import { ChatWorkspace } from "@/components/chat-workspace";

export const metadata: Metadata = { title: "Сообщения" };

export default async function ChatsPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string; conversation?: string }>;
}) {
  const params = await searchParams;
  return (
    <>
      <header className="page-intro chat-page-intro">
        <p className="eyebrow">Общение напрямую</p>
        <h1>Сообщения</h1>
        <p className="lead">Задайте поставщику вопрос и договоритесь о деталях в одном диалоге.</p>
      </header>
      <ChatWorkspace initialServiceId={params.service} initialConversationId={params.conversation} />
    </>
  );
}
