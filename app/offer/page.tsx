import type { Metadata } from "next";
import Link from "next/link";
import { LocalizedText } from "@/components/locale-provider";

export const metadata: Metadata = {
  title: "Условия использования и оферта",
  description: "Условия использования информационной платформы Marosim.",
};

const updatedAt = "2 сентября 2026 года";

export default function OfferPage() {
  return (
    <article className="legal-page">
      <header className="legal-hero">
        <p className="eyebrow"><LocalizedText ru="Правила Marosim" uz="Marosim qoidalari" /></p>
        <h1><LocalizedText ru="Условия использования и публичная оферта" uz="Foydalanish shartlari va ommaviy oferta" /></h1>
        <p>
          <LocalizedText ru="Настоящий документ определяет правила использования Marosim — информационной платформы для поиска предложений, сохранения вариантов и общения клиентов с авторами предложений." uz="Ushbu hujjat Marosim — takliflarni izlash, variantlarni saqlash hamda mijozlar va e’lon mualliflari o‘rtasida muloqot qilish uchun axborot platformasidan foydalanish qoidalarini belgilaydi." />
        </p>
        <small><LocalizedText ru={`Редакция от ${updatedAt}`} uz="2026-yil 2-sentabrdagi tahrir" /></small>
      </header>

      <aside className="legal-notice" aria-label="Статус документа">
        <strong><LocalizedText ru="Платные функции Marosim пока не подключены." uz="Marosim’ning pullik funksiyalari hozircha ulanmagan." /></strong>
        <p>
          <LocalizedText ru="До публикации полного наименования владельца, его почтового и электронного адреса, реквизитов, тарифов, порядка оплаты и возврата этот документ действует как условия использования платформы, но не является офертой Marosim на платную услугу." uz="Platforma egasining to‘liq nomi, pochta va elektron manzili, rekvizitlari, tariflari, to‘lov va qaytarish tartibi e’lon qilinmaguncha, ushbu hujjat platformadan foydalanish shartlari sifatida amal qiladi, ammo Marosim’ning pullik xizmati uchun oferta hisoblanmaydi." />
        </p>
      </aside>

      <section>
        <h2><LocalizedText ru="1. Термины и принятие условий" uz="1. Atamalar va shartlarni qabul qilish" /></h2>
        <p>
          <LocalizedText ru="«Платформа» — сайт Marosim. «Клиент» — пользователь, который ищет услуги, товары или технику. «Автор предложения» — пользователь, который размещает предложение и отвечает клиентам. Начав пользоваться Платформой, пользователь подтверждает, что ознакомился с настоящими условиями и обязуется их соблюдать." uz="«Platforma» — Marosim sayti. «Mijoz» — xizmat, mahsulot yoki texnika izlaydigan foydalanuvchi. «E’lon muallifi» — taklif joylashtiradigan va mijozlarga javob beradigan foydalanuvchi. Platformadan foydalanishni boshlash bilan foydalanuvchi ushbu shartlar bilan tanishganini va ularga rioya qilishini tasdiqlaydi." />
        </p>
      </section>

      <section>
        <h2><LocalizedText ru="2. Что делает Marosim" uz="2. Marosim nima qiladi" /></h2>
        <p>
          <LocalizedText ru="Marosim помогает находить предложения, сравнивать ориентировочные условия, сохранять варианты и начинать прямой диалог. На текущем этапе Платформа не принимает оплату, не бронирует дату, не гарантирует наличие и не является стороной сделки между Клиентом и Автором предложения." uz="Marosim takliflarni topish, taxminiy shartlarni solishtirish, variantlarni saqlash va to‘g‘ridan-to‘g‘ri suhbat boshlashga yordam beradi. Hozirgi bosqichda Platforma to‘lov qabul qilmaydi, sanani bron qilmaydi, mavjudlikni kafolatlamaydi va Mijoz bilan E’lon muallifi o‘rtasidagi bitim tomoni hisoblanmaydi." />
        </p>
      </section>

      <section>
        <h2><LocalizedText ru="3. Учётная запись" uz="3. Hisob qaydnomasi" /></h2>
        <p>
          <LocalizedText ru="Пользователь сообщает достоверные данные, не передаёт доступ к своей учётной записи третьим лицам и отвечает за действия, совершённые через неё. При подозрении на несанкционированный доступ нужно обратиться в поддержку." uz="Foydalanuvchi ishonchli ma’lumot beradi, hisobiga kirish huquqini uchinchi shaxslarga bermaydi va u orqali bajarilgan harakatlar uchun javob beradi. Ruxsatsiz kirishdan shubha qilinganda qo‘llab-quvvatlash xizmatiga murojaat qilish kerak." />
        </p>
      </section>

      <section>
        <h2><LocalizedText ru="4. Предложения и договорённости" uz="4. Takliflar va kelishuvlar" /></h2>
        <p>
          <LocalizedText ru="Цена «от», описание, фотографии, доступность и срок ответа носят информационный характер, пока Автор предложения не подтвердил их в переписке или отдельном договоре. Сообщение в чате не считается бронью или оплатой. Клиент и Автор предложения самостоятельно согласуют точный состав, цену, дату, порядок оплаты, возврата и ответственность." uz="Boshlang‘ich narx, tavsif, suratlar, mavjudlik va javob berish muddati E’lon muallifi ularni yozishmada yoki alohida shartnomada tasdiqlamaguncha axborot xarakteriga ega. Suhbatdagi xabar bron yoki to‘lov hisoblanmaydi. Mijoz va E’lon muallifi aniq tarkib, narx, sana, to‘lov, qaytarish va javobgarlik tartibini mustaqil kelishadi." />
        </p>
      </section>

      <section>
        <h2><LocalizedText ru="5. Правила для авторов предложений" uz="5. E’lon mualliflari uchun qoidalar" /></h2>
        <p>
          <LocalizedText ru="Автор размещает только законные предложения, поддерживает данные актуальными и имеет права на тексты, фотографии, товарные знаки и другие материалы карточки. Запрещены ложные сведения, скрытые обязательные платежи, дискриминация, спам и попытки выдать непроверенную статистику за гарантию качества." uz="Muallif faqat qonuniy takliflarni joylashtiradi, ma’lumotlarni yangilab turadi va karta matni, suratlari, tovar belgilari hamda boshqa materiallariga huquqqa ega bo‘ladi. Yolg‘on ma’lumot, yashirin majburiy to‘lovlar, kamsitish, spam va tekshirilmagan statistikani sifat kafolati sifatida ko‘rsatish taqiqlanadi." />
        </p>
      </section>

      <section>
        <h2><LocalizedText ru="6. Иллюстративные материалы стартового каталога" uz="6. Boshlang‘ich katalogning tasviriy materiallari" /></h2>
        <p>
          <LocalizedText ru="Часть фотографий и цен собрана из открытых источников как ориентир структуры рынка. Права на сторонние изображения сохраняются за их правообладателями. Публикация фотографии не означает партнёрство Marosim с автором объявления или изображённой компанией. Правообладатель может обратиться в поддержку для проверки источника, указания авторства или удаления материала." uz="Suratlar va narxlarning bir qismi bozor tuzilishini ko‘rsatish maqsadida ochiq manbalardan olingan. Uchinchi tomon tasvirlariga huquqlar ularning huquq egalarida qoladi. Suratning e’lon qilinishi Marosim e’lon muallifi yoki tasvirlangan kompaniya bilan hamkorligini anglatmaydi. Huquq egasi manbani tekshirish, mualliflikni ko‘rsatish yoki materialni olib tashlash uchun qo‘llab-quvvatlash xizmatiga murojaat qilishi mumkin." />
        </p>
      </section>

      <section>
        <h2><LocalizedText ru="7. Модерация" uz="7. Moderatsiya" /></h2>
        <p>
          <LocalizedText ru="Marosim вправе исправить очевидную ошибку, запросить подтверждение, скрыть карточку или ограничить доступ пользователя при нарушении правил, требования закона или угрозе другим пользователям. Существенное действие модератора фиксируется с причиной и может быть оспорено через поддержку." uz="Marosim aniq xatoni tuzatish, tasdiq so‘rash, kartani yashirish yoki qoidalar, qonun talablari buzilganda yoxud boshqa foydalanuvchilarga xavf tug‘ilganda kirishni cheklash huquqiga ega. Moderatorning muhim harakati sababi bilan qayd etiladi va qo‘llab-quvvatlash orqali e’tiroz bildirilishi mumkin." />
        </p>
      </section>

      <section>
        <h2><LocalizedText ru="8. Ответственность" uz="8. Javobgarlik" /></h2>
        <p>
          <LocalizedText ru="Пользователь самостоятельно проверяет автора предложения и условия сделки до передачи денег. Marosim отвечает за собственные действия в пределах применимого законодательства, но не отвечает за исполнение отдельной сделки между пользователями, перебои связи и обстоятельства вне разумного контроля Платформы." uz="Foydalanuvchi pul berishdan oldin E’lon muallifi va bitim shartlarini mustaqil tekshiradi. Marosim amaldagi qonunchilik doirasida o‘z harakatlari uchun javob beradi, lekin foydalanuvchilar o‘rtasidagi alohida bitim bajarilishi, aloqa uzilishi va Platformaning oqilona nazoratidan tashqaridagi holatlar uchun javob bermaydi." />
        </p>
      </section>

      <section>
        <h2><LocalizedText ru="9. Персональные данные" uz="9. Shaxsiy ma’lumotlar" /></h2>
        <p>
          <LocalizedText ru="На текущем этапе тестовые данные интерфейса хранятся локально в браузере. До подключения реальной регистрации Marosim отдельно опубликует сведения об операторе персональных данных, составе, целях, сроках и месте хранения данных, а также порядке отзыва согласия." uz="Hozirgi bosqichda interfeysning sinov ma’lumotlari brauzerda mahalliy saqlanadi. Haqiqiy ro‘yxatdan o‘tish ulanishidan oldin Marosim shaxsiy ma’lumotlar operatori, ma’lumotlar tarkibi, maqsadi, saqlash muddati va joyi hamda rozilikni qaytarib olish tartibini alohida e’lon qiladi." />
        </p>
      </section>

      <section>
        <h2><LocalizedText ru="10. Условия будущей платной оферты" uz="10. Kelajakdagi pullik oferta shartlari" /></h2>
        <p>
          <LocalizedText ru="Если Marosim введёт платное размещение, подписку, комиссию или другую платную функцию, до её запуска на этой странице будут опубликованы данные владельца Платформы, адреса и контакты, предмет услуги, тарифы, способ акцепта, порядок оплаты, изменения заказа, возврата и прекращения договора. Платная оферта начнёт действовать только с указанной в ней даты." uz="Agar Marosim pullik joylashtirish, obuna, komissiya yoki boshqa pullik funksiyani joriy etsa, u ishga tushirilishidan oldin ushbu sahifada Platforma egasining ma’lumotlari, manzil va aloqa vositalari, xizmat predmeti, tariflar, aksept usuli, to‘lov, buyurtmani o‘zgartirish, qaytarish va shartnomani bekor qilish tartibi e’lon qilinadi. Pullik oferta faqat unda ko‘rsatilgan sanadan kuchga kiradi." />
        </p>
      </section>

      <section>
        <h2><LocalizedText ru="11. Изменения документа" uz="11. Hujjatga o‘zgartirishlar" /></h2>
        <p>
          <LocalizedText ru="Новая редакция публикуется на этой странице с датой обновления. Изменения, которые требуют отдельного согласия по закону, не применяются к пользователю без такого согласия." uz="Yangi tahrir ushbu sahifada yangilanish sanasi bilan e’lon qilinadi. Qonunga ko‘ra alohida rozilik talab qiladigan o‘zgartirishlar bunday roziliksiz foydalanuvchiga nisbatan qo‘llanmaydi." />
        </p>
      </section>

      <section>
        <h2><LocalizedText ru="12. Поддержка и споры" uz="12. Qo‘llab-quvvatlash va nizolar" /></h2>
        <p>
          <LocalizedText ru="Сначала направьте обращение в поддержку по номеру" uz="Avval qo‘llab-quvvatlash xizmatiga ushbu raqam orqali murojaat qiling:" /> <a href="tel:+998900000000">+998 90 000-00-00</a>. {" "}
          <LocalizedText ru="Применяется законодательство Республики Узбекистан. Если спор не удалось решить переговорами, он передаётся на рассмотрение в порядке, установленном применимым законодательством." uz="O‘zbekiston Respublikasi qonunchiligi qo‘llanadi. Nizoni muzokara orqali hal qilib bo‘lmasa, u amaldagi qonunchilikda belgilangan tartibda ko‘rib chiqishga topshiriladi." />
        </p>
      </section>

      <footer className="legal-actions">
        <Link className="button button-primary" href="/">
          <LocalizedText ru="Вернуться на главную" uz="Bosh sahifaga qaytish" />
        </Link>
        <Link className="button button-ghost" href="/catalog">
          <LocalizedText ru="Открыть каталог" uz="Katalogni ochish" />
        </Link>
      </footer>
    </article>
  );
}
