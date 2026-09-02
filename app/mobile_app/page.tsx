import type { Metadata } from "next";
import { MobileAppHome } from "@/components/mobile-app-home";

export const metadata: Metadata = { title: "Мобильное приложение Marosim" };

export default function MobileAppPage() {
  return <MobileAppHome />;
}
