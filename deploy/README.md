# Развертывание EventHub UZ в выделенном dev-space

Контейнер запускается без root-возможностей, с read-only файловой системой и публикует порт только на `127.0.0.1`. Внешний HTTPS и путь на корпоративном домене должен дать существующий reverse proxy сервера.

## Подготовка пространства

1. Скопировать `deploy/docker-compose.server.yml` в отдельный каталог, принадлежащий техническому пользователю EventHub.
2. Авторизовать Docker для чтения образа `ghcr.io/malikvalikhodjaev/event-olx`, если пакет закрытый.
3. Создать `.env` рядом с compose-файлом и задать фактические `NEXT_PUBLIC_APP_URL` и `EVENTHUB_PORT`.
4. Запустить:

```bash
docker compose -f docker-compose.server.yml pull
docker compose -f docker-compose.server.yml up -d
docker compose -f docker-compose.server.yml ps
curl --fail http://127.0.0.1:3000/api/health
```

## Обновление и откат

Перед обновлением сохранить текущий digest из `docker inspect eventhub-dev`. Затем повторить `pull` и `up -d`. Для отката в compose-файле указать ранее проверенный тег релиза, например `v0.1.0-alpha.1`, и снова выполнить `up -d`.

Публичный URL нельзя честно зафиксировать до получения адреса, маршрута reverse proxy и подтверждения доступного порта от владельца dev-space.
