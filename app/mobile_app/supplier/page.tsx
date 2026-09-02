import type { Metadata } from "next";
import { MobileSupplierHome } from "@/components/mobile-supplier-home";

export const metadata: Metadata = { title: "Авторам предложений — мобильное приложение" };

export default function MobileSupplierPage() {
  return <MobileSupplierHome />;
}
