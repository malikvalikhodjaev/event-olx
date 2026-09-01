import type { Metadata } from "next";
import { RequestList } from "@/components/request-list";

export const metadata: Metadata = { title: "Мои заявки" };

export default function RequestsPage() {
  return (
    <>
      <header className="page-intro"><p className="eyebrow">Кабинет клиента</p><h1>Заявки и следующий шаг</h1><p className="lead">История запроса остаётся видимой. Статус заявки не подменяет бронь или оплату.</p></header>
      <RequestList />
    </>
  );
}
