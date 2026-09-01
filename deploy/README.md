# Развертывание Marosim в выделенном dev-space

Фактическое dev-окружение изолировано от FOM/Datfo:

- код и runtime: `/home/malik/apps/eventhub-uz`;
- процесс: пользовательский `systemd`-сервис `eventhub-uz.service`;
- внутренний адрес: `http://127.0.0.1:3001`;
- внешний адрес: `https://eventhub-dev.fom-analytics.uz`;
- публикация: существующий Cloudflare Tunnel, без открытия порта приложения наружу.

В production-процессе не используется системный Node.js 18. Для Marosim закреплен собственный проверенный Node.js `22.23.2`, поэтому обновление MVP не влияет на Datfo. Технические идентификаторы `eventhub-uz` и текущий hostname сохранены до отдельной инфраструктурной миграции.

## Первичная установка на текущем сервере

```bash
mkdir -p /home/malik/apps/eventhub-uz/logs /home/malik/apps/eventhub-uz/runtime
git clone https://github.com/malikvalikhodjaev/event-olx.git /home/malik/apps/eventhub-uz/repo

cd /home/malik/apps/eventhub-uz/runtime
curl --fail --show-error --location --remote-name https://nodejs.org/dist/v22.23.2/node-v22.23.2-linux-x64.tar.xz
printf '%s  %s\n' 'd60acfe00a2932254bb0ad20e01b0d74397a0875595de719654b214f4b03f307' 'node-v22.23.2-linux-x64.tar.xz' | sha256sum --check
tar --extract --file node-v22.23.2-linux-x64.tar.xz
ln -s node-v22.23.2-linux-x64 node

cd /home/malik/apps/eventhub-uz/repo
/home/malik/apps/eventhub-uz/runtime/node/bin/corepack pnpm install --frozen-lockfile
/home/malik/apps/eventhub-uz/runtime/node/bin/corepack pnpm build
cp -R public .next/standalone/public
mkdir -p .next/standalone/.next
cp -R .next/static .next/standalone/.next/static

cp deploy/eventhub-uz.service /home/malik/.config/systemd/user/eventhub-uz.service
systemctl --user daemon-reload
systemctl --user enable --now eventhub-uz.service
curl --fail http://127.0.0.1:3001/api/health
```

В активный `~/.cloudflared/config.yml` перед завершающим `http_status:404` добавляется маршрут:

```yaml
    - hostname: eventhub-dev.fom-analytics.uz
      service: http://127.0.0.1:3001
```

DNS связывается с уже действующим именованным tunnel, после чего конфигурация проверяется до перезапуска:

```bash
cloudflared tunnel route dns 08ddeab2-0062-4eaf-9452-3d3b45643fad eventhub-dev.fom-analytics.uz
cloudflared tunnel ingress validate --config /home/malik/.cloudflared/config.yml
systemctl --user restart cloudflared.service
curl --fail https://eventhub-dev.fom-analytics.uz/api/health
```

## Обновление

```bash
cd /home/malik/apps/eventhub-uz/repo
git fetch --tags origin
git pull --ff-only origin main
/home/malik/apps/eventhub-uz/runtime/node/bin/corepack pnpm install --frozen-lockfile
/home/malik/apps/eventhub-uz/runtime/node/bin/corepack pnpm build
rm -rf .next/standalone/public .next/standalone/.next/static
cp -R public .next/standalone/public
mkdir -p .next/standalone/.next
cp -R .next/static .next/standalone/.next/static
systemctl --user restart eventhub-uz.service
curl --fail http://127.0.0.1:3001/api/health
```

## Откат

Откат выполняется на конкретную проверенную версию, затем приложение пересобирается теми же командами. Текущая первая контрольная версия — `v0.1.0-alpha.1`.

```bash
cd /home/malik/apps/eventhub-uz/repo
git checkout v0.1.0-alpha.1
/home/malik/apps/eventhub-uz/runtime/node/bin/corepack pnpm install --frozen-lockfile
/home/malik/apps/eventhub-uz/runtime/node/bin/corepack pnpm build
rm -rf .next/standalone/public .next/standalone/.next/static
cp -R public .next/standalone/public
mkdir -p .next/standalone/.next
cp -R .next/static .next/standalone/.next/static
systemctl --user restart eventhub-uz.service
```

Контейнерный вариант в `docker-compose.server.yml` сохранен для сервера с Docker, но на текущем хосте используется системный сервис выше.
