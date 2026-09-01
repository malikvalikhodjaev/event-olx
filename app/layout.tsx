import type { Metadata, Viewport } from "next";
import "./globals.css";
import { DemoSessionProvider } from "@/components/demo-session";
import { ServiceWorkerRegister } from "@/components/service-worker-register";
import { SiteHeader } from "@/components/site-header";
import { MobileNavigation } from "@/components/mobile-navigation";

export const metadata: Metadata = {
  title: { default: "EventHub UZ", template: "%s · EventHub UZ" },
  description: "Каталог и заявки на услуги для свадеб, культурных и деловых мероприятий в Узбекистане.",
  applicationName: "EventHub UZ",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "EventHub", statusBarStyle: "black-translucent" },
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
              <strong>EventHub UZ</strong>
              <span>Каталог и заявки. Без платежей и юридически значимой брони.</span>
            </div>
          </footer>
        </DemoSessionProvider>
      </body>
    </html>
  );
}
