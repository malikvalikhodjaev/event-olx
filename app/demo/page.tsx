import type { Metadata } from "next";
import { DemoAccounts } from "@/components/demo-accounts";

export const metadata: Metadata = { title: "Тестовые роли" };

export default function DemoPage() {
  return (
    <>
      <header className="page-intro"><p className="eyebrow">Пользовательское тестирование</p><h1>Пройдите продукт от лица каждой роли</h1><p className="lead">Аккаунты локальные и демонстрационные. Переключение роли не является production-аутентификацией.</p></header>
      <DemoAccounts />
    </>
  );
}
