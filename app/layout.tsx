import type { Metadata, Viewport } from "next";
import { Geologica } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { DemoSessionProvider } from "@/components/demo-session";
import { ServiceWorkerRegister } from "@/components/service-worker-register";
import { SiteHeader } from "@/components/site-header";
import { MobileNavigation } from "@/components/mobile-navigation";

const geologica = Geologica({
  subsets: ["cyrillic", "latin"],
  display: "swap",
  variable: "--font-geologica",
});

export const metadata: Metadata = {
  title: { default: "Marosim", template: "%s · Marosim" },
  description: "Услуги, товары и техника для свадеб, культурных и деловых мероприятий в Узбекистане.",
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
    <html lang="ru" data-scroll-behavior="smooth">
      <body className={geologica.variable}>
        <DemoSessionProvider>
          <ServiceWorkerRegister />
          <SiteHeader />
          <main className="main">
            <div className="shell">{children}</div>
          </main>
          <MobileNavigation />
          <footer className="site-footer">
            <div className="shell footer-row">
              <div className="footer-copy">
                <strong>Marosim</strong>
                <span>Находите всё нужное и собирайте событие в одном месте.</span>
              </div>
              <div className="footer-support">
                <span>Нужна помощь?</span>
                <a href="tel:+998900000000">Поддержка: +998 90 000-00-00</a>
                <Link href="/offer">Условия использования и оферта</Link>
                <small>Фото и цены в стартовом каталоге ориентировочные.</small>
              </div>
            </div>
          </footer>
        </DemoSessionProvider>
      </body>
    </html>
  );
}
