import { redirect } from "next/navigation";

export default async function NewRequestPage({ searchParams }: { searchParams: Promise<{ service?: string }> }) {
  const params = await searchParams;
  redirect(`/chats${params.service ? `?service=${encodeURIComponent(params.service)}` : ""}`);
}
