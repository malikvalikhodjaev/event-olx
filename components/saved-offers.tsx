"use client";

import Link from "next/link";
import { useDemoSession } from "@/components/demo-session";
import { ServiceCard } from "@/components/service-card";
import { services } from "@/lib/demo-data";

export function SavedOffers() {
  const { state } = useDemoSession();

  if (!state.signedIn) {
    return (
      <section className="panel empty-state">
        <h2>Войдите, чтобы открыть сохранённые предложения</h2>
        <p>После входа здесь будут карточки, которые вы отметили в каталоге.</p>
        <Link className="button button-primary" href="/login?role=client&next=/saved">Войти</Link>
      </section>
    );
  }

  const saved = services.filter((service) => state.shortlist.includes(service.id));

  if (!saved.length) {
    return (
      <section className="panel empty-state">
        <h2>Пока ничего не сохранено</h2>
        <p>Нажмите на сердечко в карточке предложения, чтобы вернуться к нему позже.</p>
        <Link className="button button-primary" href="/catalog">Найти предложения</Link>
      </section>
    );
  }

  return (
    <div className="catalog-results saved-results">
      {saved.map((service) => <ServiceCard key={service.id} service={service} />)}
    </div>
  );
}
