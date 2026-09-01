#!/usr/bin/env bash

set -Eeuo pipefail

target_commit="${1:?Pass the exact commit to deploy}"
app_root="/home/malik/apps/eventhub-uz"
repo_root="${app_root}/repo"
runtime_node="${app_root}/runtime/node/bin"
service_name="eventhub-uz.service"
export PATH="${runtime_node}:${PATH}"

if [[ "$(id -un)" != "malik" ]]; then
  printf 'Deployment must run as malik.\n' >&2
  exit 1
fi

if [[ ! -d "${repo_root}/.git" || ! -x "${runtime_node}/node" ]]; then
  printf 'Marosim repository or isolated Node.js runtime is missing.\n' >&2
  exit 1
fi

if [[ -n "$(git -C "${repo_root}" status --porcelain)" ]]; then
  printf 'Server repository has local changes; deployment stopped.\n' >&2
  git -C "${repo_root}" status --short >&2
  exit 1
fi

old_commit="$(git -C "${repo_root}" rev-parse HEAD)"
mkdir -p "${app_root}/releases"
backup_file="${app_root}/releases/runtime-${old_commit:0:12}.tar.gz"

if [[ ! -f "${backup_file}" ]]; then
  tar --create --gzip --file "${backup_file}" \
    --directory "${repo_root}" \
    .next/standalone .next/static
fi

restore_previous_runtime() {
  local exit_code="$1"
  trap - ERR
  printf 'Deployment failed; restoring the previous runtime.\n' >&2
  tar --extract --gzip --file "${backup_file}" --directory "${repo_root}"
  systemctl --user restart "${service_name}"
  exit "${exit_code}"
}

trap 'restore_previous_runtime $?' ERR

git -C "${repo_root}" fetch origin main
remote_commit="$(git -C "${repo_root}" rev-parse origin/main)"
if [[ "${remote_commit}" != "${target_commit}" ]]; then
  printf 'origin/main is %s, expected %s.\n' "${remote_commit}" "${target_commit}" >&2
  exit 1
fi

git -C "${repo_root}" merge --ff-only origin/main
"${runtime_node}/corepack" install --global pnpm@11.19.0
pnpm --dir "${repo_root}" install --frozen-lockfile
pnpm --dir "${repo_root}" build

standalone_root="$(realpath "${repo_root}/.next/standalone")"
if [[ "${standalone_root}" != "${repo_root}/.next/standalone" ]]; then
  printf 'Unexpected standalone directory: %s\n' "${standalone_root}" >&2
  exit 1
fi

rm -rf -- "${standalone_root}/public" "${standalone_root}/.next/static"
cp -R -- "${repo_root}/public" "${standalone_root}/public"
mkdir -p "${standalone_root}/.next"
cp -R -- "${repo_root}/.next/static" "${standalone_root}/.next/static"

systemctl --user restart "${service_name}"
health_response=""
for _attempt in {1..20}; do
  if health_response="$(curl --fail --silent --max-time 3 http://127.0.0.1:3001/api/health 2>/dev/null)"; then
    break
  fi
  sleep 1
done
if [[ -z "${health_response}" ]]; then
  printf 'Marosim did not become healthy after restart.\n' >&2
  exit 1
fi
printf '%s' "${health_response}"
trap - ERR
printf '\nDeployed %s successfully.\n' "${target_commit}"
