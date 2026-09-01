"use client";

import { useState } from "react";
import Link from "next/link";
import { addDemoRequest } from "@/lib/demo-store";
import { getServiceById, getSupplierById, services } from "@/lib/demo-data";
import { requestSchema, type RequestInput } from "@/lib/validation";
import type { DemoRequest } from "@/lib/types";

const initialValues: RequestInput = {
  clientName: "",
  clientPhone: "+998 ",
  serviceId: "",
  eventType: "Свадьба",
  eventDate: "",
  city: "Ташкент",
  guestCount: 80,
  budget: 0,
  message: "",
};

export function RequestForm({ initialServiceId = "" }: { initialServiceId?: string }) {
  const [values, setValues] = useState<RequestInput>({ ...initialValues, serviceId: initialServiceId });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [created, setCreated] = useState<DemoRequest | null>(null);

  function update<K extends keyof RequestInput>(key: K, value: RequestInput[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const parsed = requestSchema.safeParse(values);
    if (!parsed.success) {
      setErrors(Object.fromEntries(parsed.error.issues.map((issue) => [String(issue.path[0]), issue.message])));
      return;
    }
    const service = getServiceById(parsed.data.serviceId);
    if (!service) {
      setErrors({ serviceId: "Услуга не найдена" });
      return;
    }
    const request: DemoRequest = {
      id: crypto.randomUUID(),
      ...parsed.data,
      supplierId: service.supplierId,
      status: "submitted",
      createdAt: new Date().toISOString(),
      firstViewedAt: null,
      firstRespondedAt: null,
    };
    addDemoRequest(request);
    setErrors({});
    setCreated(request);
  }

  if (created) {
    const service = getServiceById(created.serviceId);
    const supplier = getSupplierById(created.supplierId);
    return (
      <section className="panel">
        <div className="callout">
          <strong>Заявка отправлена поставщику {supplier?.name}</strong><br />
          {service?.title}. Статус и следующий шаг доступны в кабинете заявок.
        </div>
        <p className="muted" style={{ marginTop: 16 }}>
          Это запрос на обсуждение. Он не блокирует дату, не является договором, бронью или оплатой.
        </p>
        <div className="actions">
          <Link className="button button-primary" href="/requests">Открыть мои заявки</Link>
          <Link className="button button-secondary" href="/catalog">Вернуться в каталог</Link>
        </div>
      </section>
    );
  }

  return (
    <form className="panel" onSubmit={submit} noValidate>
      <div className="form-grid">
        <div className="field span-2">
          <label htmlFor="serviceId">Услуга</label>
          <select id="serviceId" value={values.serviceId} onChange={(event) => update("serviceId", event.target.value)}>
            <option value="">Выберите услугу</option>
            {services.map((service) => {
              const supplier = getSupplierById(service.supplierId);
              return <option key={service.id} value={service.id}>{service.title} · {supplier?.name}</option>;
            })}
          </select>
          {errors.serviceId ? <span className="error-text small">{errors.serviceId}</span> : null}
        </div>
        <div className="field">
          <label htmlFor="clientName">Ваше имя</label>
          <input id="clientName" value={values.clientName} onChange={(event) => update("clientName", event.target.value)} />
          {errors.clientName ? <span className="error-text small">{errors.clientName}</span> : null}
        </div>
        <div className="field">
          <label htmlFor="clientPhone">Телефон</label>
          <input id="clientPhone" inputMode="tel" value={values.clientPhone} onChange={(event) => update("clientPhone", event.target.value)} />
          {errors.clientPhone ? <span className="error-text small">{errors.clientPhone}</span> : null}
        </div>
        <div className="field">
          <label htmlFor="eventType">Тип мероприятия</label>
          <select id="eventType" value={values.eventType} onChange={(event) => update("eventType", event.target.value)}>
            <option>Свадьба</option><option>Никах</option><option>Тимбилдинг</option><option>Тренинг</option><option>Конференция</option><option>Другое</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="eventDate">Дата мероприятия</label>
          <input id="eventDate" type="date" value={values.eventDate} onChange={(event) => update("eventDate", event.target.value)} />
          {errors.eventDate ? <span className="error-text small">{errors.eventDate}</span> : null}
        </div>
        <div className="field">
          <label htmlFor="city">Город</label>
          <input id="city" value={values.city} onChange={(event) => update("city", event.target.value)} />
          {errors.city ? <span className="error-text small">{errors.city}</span> : null}
        </div>
        <div className="field">
          <label htmlFor="guestCount">Количество гостей</label>
          <input id="guestCount" type="number" min="1" value={values.guestCount} onChange={(event) => update("guestCount", Number(event.target.value))} />
          {errors.guestCount ? <span className="error-text small">{errors.guestCount}</span> : null}
        </div>
        <div className="field span-2">
          <label htmlFor="budget">Бюджетный ориентир, сум</label>
          <input id="budget" type="number" min="0" step="100000" value={values.budget || ""} onChange={(event) => update("budget", Number(event.target.value))} />
          {errors.budget ? <span className="error-text small">{errors.budget}</span> : null}
        </div>
        <div className="field span-2">
          <label htmlFor="message">Что важно уточнить</label>
          <textarea id="message" value={values.message} onChange={(event) => update("message", event.target.value)} placeholder="Расскажите о формате, времени, составе услуги и главном вопросе поставщику." />
          {errors.message ? <span className="error-text small">{errors.message}</span> : null}
        </div>
      </div>
      <div className="callout callout-warning" style={{ marginTop: 16 }}>
        Отправка заявки не означает бронь, оплату или гарантированную цену. Поставщик должен подтвердить условия отдельно.
      </div>
      <button className="button button-primary" style={{ marginTop: 16 }} type="submit">Отправить заявку</button>
    </form>
  );
}
