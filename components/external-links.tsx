"use client";

import { useLocale } from "@/components/locale-provider";
import type { ExternalLink } from "@/lib/types";

function PlatformIcon({ platform }: { platform: ExternalLink["platform"] }) {
  if (platform === "instagram") {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" /></svg>;
  }
  if (platform === "youtube") {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="5" width="20" height="14" rx="4" fill="none" stroke="currentColor" strokeWidth="2" /><path d="m10 9 5 3-5 3z" fill="currentColor" /></svg>;
  }
  if (platform === "telegram") {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 3 3 10.4l6.4 2.2L18 6.8l-6.7 7 1 6.2 3.1-4.1 3.6 2.7z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /></svg>;
  }
  return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M3 12h18M12 3c3 3.1 3 14.9 0 18M12 3c-3 3.1-3 14.9 0 18" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>;
}

export function ExternalLinks({ links }: { links: ExternalLink[] }) {
  const { text } = useLocale();
  if (!links.length) return null;
  const labels = {
    instagram: "Instagram",
    telegram: "Telegram",
    youtube: "YouTube",
    web: text("Сайт", "Sayt"),
  };

  return <div className="external-links" aria-label={text("Внешние ссылки автора", "Muallifning tashqi havolalari")}>
    {links.map((link) => <a key={`${link.platform}-${link.url}`} href={link.url} target="_blank" rel="noopener noreferrer" className="external-link">
      <PlatformIcon platform={link.platform} />
      <span>{link.platform === "web" && new URL(link.url).hostname.endsWith("olx.uz") ? "OLX" : labels[link.platform]}</span>
      <span aria-hidden="true">↗</span>
    </a>)}
  </div>;
}

export function ClaimProfileLink() {
  const { text } = useLocale();
  const label = text("Это ваша страница? Напишите нам, чтобы подтвердить профиль.", "Bu sizning sahifangizmi? Profilni tasdiqlash uchun bizga yozing.");
  return <a
    className="claim-profile-link"
    href="https://t.me/malik_valikhodjaev"
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    title={label}
    data-tooltip={label}
  ><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M9.6 9a2.5 2.5 0 0 1 4.8 1c0 1.8-2.4 2-2.4 3.6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><circle cx="12" cy="17.2" r="1" fill="currentColor" /></svg></a>;
}
