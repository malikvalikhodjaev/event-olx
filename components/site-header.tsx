import Link from "next/link";

export function SiteHeader() {
  return (
    <>
      <div className="product-note">Заявка помогает связаться с поставщиком и не является бронью или оплатой</div>
      <header className="site-header">
        <div className="shell header-row">
          <Link href="/" className="brand" aria-label="EventHub UZ — главная">
            <span className="brand-mark">E</span>
            <span>EventHub UZ</span>
          </Link>
          <nav className="top-nav" aria-label="Основная навигация">
            <Link href="/catalog">Каталог</Link>
            <Link href="/planner">Планировщик</Link>
            <Link href="/requests">Заявки</Link>
            <Link href="/supplier">Поставщик</Link>
            <Link href="/admin">Модерация</Link>
            <Link href="/mobile_app">На телефон</Link>
          </nav>
          <Link className="header-account" href="/account">Кабинет</Link>
        </div>
      </header>
    </>
  );
}
