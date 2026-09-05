import type { Metadata, Viewport } from "next";
import { Geologica } from "next/font/google";
import "./globals.css";
import { DemoSessionProvider } from "@/components/demo-session";
import { LocaleProvider } from "@/components/locale-provider";
import { ServiceWorkerRegister } from "@/components/service-worker-register";
import { SiteHeader } from "@/components/site-header";
import { MobileNavigation } from "@/components/mobile-navigation";
import { SiteFooter } from "@/components/site-footer";

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
        <LocaleProvider initialLocale="ru">
          <DemoSessionProvider>
            <ServiceWorkerRegister />
            <SiteHeader />
            <main className="main">
              <div className="shell">{children}</div>
            </main>
            <MobileNavigation />
            <SiteFooter />
          </DemoSessionProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
