"use client";

import Link from "next/link";
import { useDemoSession } from "@/components/demo-session";
import { ServiceCard } from "@/components/service-card";
import { services } from "@/lib/demo-data";
import { useLocale } from "@/components/locale-provider";

export function SavedOffers() {
  const { state } = useDemoSession();
  const { text } = useLocale();

  if (!state.signedIn) {
    return (
      <section className="panel empty-state">
        <h2>{text("Войдите, чтобы открыть сохранённые предложения", "Saqlangan takliflarni ochish uchun kiring")}</h2>
        <p>{text("После входа здесь будут карточки, которые вы отметили в каталоге.", "Kirgandan so‘ng katalogda belgilagan kartalaringiz shu yerda bo‘ladi.")}</p>
        <Link className="button button-primary" href="/login?role=client&next=/saved">{text("Войти", "Kirish")}</Link>
      </section>
    );
  }

  const saved = services.filter((service) => state.shortlist.includes(service.id));

  if (!saved.length) {
    return (
      <section className="panel empty-state">
        <h2>{text("Пока ничего не сохранено", "Hozircha hech narsa saqlanmagan")}</h2>
        <p>{text("Нажмите на сердечко в карточке предложения, чтобы вернуться к нему позже.", "Taklifga keyinroq qaytish uchun kartadagi yurakchani bosing.")}</p>
        <Link className="button button-primary" href="/catalog">{text("Найти предложения", "Takliflarni topish")}</Link>
      </section>
    );
  }

  return (
    <div className="catalog-results saved-results">
      {saved.map((service) => <ServiceCard key={service.id} service={service} />)}
    </div>
  );
}
