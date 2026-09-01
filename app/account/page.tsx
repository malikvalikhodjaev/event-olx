import type { Metadata } from "next";
import { RoleSwitcher } from "@/components/role-switcher";

export const metadata: Metadata = { title: "Рабочая область" };

export default function AccountPage() {
  return (
    <>
      <header className="page-intro">
        <p className="eyebrow">Рабочая область</p>
        <h1>Выберите свою роль</h1>
        <p className="lead">Переключайтесь между задачами клиента, организатора, поставщика и администратора.</p>
      </header>
      <RoleSwitcher />
    </>
  );
}
