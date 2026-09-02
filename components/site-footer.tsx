"use client";

import Link from "next/link";
import { useLocale } from "@/components/locale-provider";

export function SiteFooter() {
  const { text } = useLocale();

  return (
    <footer className="site-footer">
      <div className="shell footer-row">
        <div className="footer-copy">
          <strong>Marosim</strong>
          <span>{text("Находите всё нужное и собирайте событие в одном месте.", "Kerakli narsalarni toping va tadbirni bir joyda tashkil qiling.")}</span>
        </div>
        <div className="footer-support">
          <span>{text("Нужна помощь?", "Yordam kerakmi?")}</span>
          <a href="tel:+998900000000">{text("Поддержка", "Qo‘llab-quvvatlash")}: +998 90 000-00-00</a>
          <Link href="/offer">{text("Условия использования и оферта", "Foydalanish shartlari va oferta")}</Link>
          <small>{text("Фото и цены в стартовом каталоге ориентировочные.", "Boshlang‘ich katalogdagi suratlar va narxlar taxminiy.")}</small>
        </div>
      </div>
    </footer>
  );
}
