import type { Metadata } from "next";
import { ChatWorkspace } from "@/components/chat-workspace";
import { LocalizedText } from "@/components/locale-provider";

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
        <p className="eyebrow"><LocalizedText ru="Общение напрямую" uz="To‘g‘ridan-to‘g‘ri muloqot" /></p>
        <h1><LocalizedText ru="Сообщения" uz="Xabarlar" /></h1>
        <p className="lead"><LocalizedText ru="Задайте автору предложения вопрос и договоритесь о деталях в одном диалоге." uz="E’lon muallifiga savol bering va barcha tafsilotlarni bitta suhbatda kelishib oling." /></p>
      </header>
      <ChatWorkspace initialServiceId={params.service} initialConversationId={params.conversation} />
    </>
  );
}
