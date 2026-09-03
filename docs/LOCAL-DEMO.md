# Локальный показ Marosim

Локальная версия работает на этом компьютере и не зависит от внешнего сервера.

## Запуск

Дважды нажмите `START-MAROSIM-LOCAL.bat` в корне проекта. Дождитесь зелёной строки «Marosim работает локально», затем откройте нужную ссылку.

- Главная: [http://localhost:3000](http://localhost:3000)
- Каталог: [http://localhost:3000/catalog](http://localhost:3000/catalog)
- Вход автора предложения: [http://localhost:3000/login?role=supplier&next=/supplier](http://localhost:3000/login?role=supplier&next=/supplier)
- Мобильное приложение: [http://localhost:3000/mobile_app](http://localhost:3000/mobile_app)
- Мобильный раздел автора: [http://localhost:3000/mobile_app/supplier](http://localhost:3000/mobile_app/supplier)
- Внутренняя админка: [http://localhost:3000/login?role=admin&next=/admin](http://localhost:3000/login?role=admin&next=/admin)
- Условия использования: [http://localhost:3000/offer](http://localhost:3000/offer)

Вход через Google имитируется сразу. Код для имитации входа по телефону: `1234`. Выбор языка `O‘Z | RU`, каталог, фотографии, сохранённые предложения и остальные demo-сценарии работают локально.

## Остановка

Дважды нажмите `STOP-MAROSIM-LOCAL.bat`. Логи запуска находятся в папке `.local-demo`, которая не добавляется в Git.
