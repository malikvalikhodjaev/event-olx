import type { Metadata, Viewport } from "next";
import "./globals.css";
import { DemoSessionProvider } from "@/components/demo-session";
import { ServiceWorkerRegister } from "@/components/service-worker-register";
import { SiteHeader } from "@/components/site-header";
import { MobileNavigation } from "@/components/mobile-navigation";

export const metadata: Metadata = {
  title: { default: "Marosim", template: "%s · Marosim" },
  description: "Каталог и заявки на услуги для свадеб, культурных и деловых мероприятий в Узбекистане.",
  applicationName: "Marosim",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "Marosim", statusBarStyle: "black-translucent" },
};

export const viewport: Viewport = {
  themeColor: "#ffdc00",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>
        <DemoSessionProvider>
          <ServiceWorkerRegister />
          <SiteHeader />
          <main className="main">
            <div className="shell">{children}</div>
          </main>
          <MobileNavigation />
          <footer className="site-footer">
            <div className="shell footer-row">
              <strong>Marosim</strong>
              <span>Находите услуги и собирайте событие в одном месте.</span>
            </div>
          </footer>
        </DemoSessionProvider>
      </body>
    </html>
  );
}
