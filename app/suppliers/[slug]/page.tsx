import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ServiceCard } from "@/components/service-card";
import { StatusBadge } from "@/components/status-badge";
import { services, suppliers } from "@/lib/demo-data";
import { formatDateTime, freshnessState, responseLabel } from "@/lib/format";

export function generateStaticParams() {
  return suppliers.map((supplier) => ({ slug: supplier.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const supplier = suppliers.find((item) => item.slug === slug);
  return { title: supplier?.name ?? "Поставщик" };
}

export default async function SupplierPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supplier = suppliers.find((item) => item.slug === slug);
  if (!supplier) notFound();
  const supplierServices = services.filter((service) => service.supplierId === supplier.id && service.published);
  const freshness = freshnessState(supplier.updatedAt);

  return (
    <>
      <header className="page-intro">
        <div className="badge-row">
          <StatusBadge tone={supplier.verified ? "success" : "warning"}>{supplier.verificationLabel}</StatusBadge>
          <StatusBadge tone={freshness.tone}>{freshness.label}</StatusBadge>
        </div>
        <h1>{supplier.name}</h1>
        <p className="lead">{supplier.description}</p>
      </header>
      <div className="split">
        <section>
          <div className="section-heading"><div><p className="eyebrow">Предложения</p><h2>Услуги поставщика</h2></div></div>
          <div className="grid grid-2">
            {supplierServices.map((service) => <ServiceCard key={service.id} service={service} />)}
          </div>
          <section className="section">
            <p className="eyebrow">Портфолио</p>
            <div className="grid grid-3">
              {supplier.portfolio.map((item, index) => (
                <article className="card card-muted" key={item}>
                  <div className="category-icon">{index + 1}</div>
                  <strong>{item}</strong>
                </article>
              ))}
            </div>
          </section>
        </section>
        <aside className="panel sticky-panel">
          <p className="eyebrow">Надёжность выбора</p>
          <h3>Факты вместо неподтверждённых звёзд</h3>
          <div className="metric-list">
            <div className="metric"><span>Город</span><strong>{supplier.city}</strong></div>
            <div className="metric"><span>Профиль обновлён</span><strong>{formatDateTime(supplier.updatedAt)}</strong></div>
            <div className="metric"><span>Ответы</span><strong>{responseLabel(supplier.responseMedianMinutes, supplier.responseSampleSize)}</strong></div>
            <div className="metric"><span>Выборка</span><strong>{supplier.responseSampleSize} заявок</strong></div>
          </div>
          <div className="callout callout-warning" style={{ marginTop: 16 }}>
            Публичного рейтинга пока нет: авторизация подтверждает аккаунт, но не реальный опыт заказа. Цена и свободная дата подтверждаются в заявке.
          </div>
          {supplierServices[0] ? (
            <Link className="button button-primary" style={{ width: "100%", marginTop: 16 }} href={`/requests/new?service=${supplierServices[0].id}`}>
              Отправить заявку
            </Link>
          ) : null}
        </aside>
      </div>
    </>
  );
}
