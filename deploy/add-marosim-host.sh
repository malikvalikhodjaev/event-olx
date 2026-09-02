#!/usr/bin/env bash

set -Eeuo pipefail

tunnel_id="08ddeab2-0062-4eaf-9452-3d3b45643fad"
new_hostname="marosim.fom-analytics.uz"
old_hostname="marosim-dev.fom-analytics.uz"
legacy_hostname="eventhub-dev.fom-analytics.uz"
config_file="/home/malik/.cloudflared/config.yml"
service_name="cloudflared.service"
app_service="http://127.0.0.1:3001"
config_changed=0
temp_file=""
backup_file=""

if [[ "$(id -un)" != "malik" ]]; then
  printf 'Cloudflare route setup must run as malik.\n' >&2
  exit 1
fi

for required_command in cloudflared systemctl curl awk install grep date mktemp rm sleep; do
  if ! command -v "${required_command}" >/dev/null 2>&1; then
    printf 'Required command is missing: %s\n' "${required_command}" >&2
    exit 1
  fi
done

if [[ ! -f "${config_file}" ]]; then
  printf 'Cloudflare config is missing: %s\n' "${config_file}" >&2
  exit 1
fi

rollback_config() {
  local exit_code="$?"
  trap - ERR
  if [[ "${config_changed}" -eq 1 && -n "${backup_file}" && -f "${backup_file}" ]]; then
    printf 'Route setup failed; restoring the previous Cloudflare config.\n' >&2
    install -m 600 -- "${backup_file}" "${config_file}"
    cloudflared tunnel ingress validate --config "${config_file}" >/dev/null
    systemctl --user restart "${service_name}"
  fi
  if [[ -n "${temp_file}" && -f "${temp_file}" ]]; then
    rm -f -- "${temp_file}"
  fi
  exit "${exit_code}"
}

trap rollback_config ERR

backup_config() {
  if [[ -z "${backup_file}" ]]; then
    backup_file="${config_file}.backup-$(date +%Y%m%d-%H%M%S)"
    install -m 600 -- "${config_file}" "${backup_file}"
  fi
}

if ! grep -Fq -- "hostname: ${new_hostname}" "${config_file}"; then
  backup_config
  temp_file="$(mktemp /tmp/marosim-cloudflared-config.XXXXXX)"
  awk -v hostname="${new_hostname}" -v upstream="${app_service}" '
    BEGIN { inserted = 0 }
    !inserted && $0 ~ /^[[:space:]]*-[[:space:]]+service:[[:space:]]*http_status:404/ {
      match($0, /^[[:space:]]*/)
      indent = substr($0, RSTART, RLENGTH)
      print indent "- hostname: " hostname
      print indent "  service: " upstream
      inserted = 1
    }
    { print }
    END { if (!inserted) exit 42 }
  ' "${config_file}" > "${temp_file}"
  install -m 600 -- "${temp_file}" "${config_file}"
  config_changed=1
fi

cloudflared tunnel route dns --overwrite-dns "${tunnel_id}" "${new_hostname}"
cloudflared tunnel ingress validate --config "${config_file}"
systemctl --user restart "${service_name}"

new_health=""
for _attempt in {1..20}; do
  if new_health="$(curl --fail --silent --max-time 5 "https://${new_hostname}/api/health" 2>/dev/null)"; then
    break
  fi
  sleep 2
done

if [[ -z "${new_health}" ]]; then
  printf 'New Marosim hostname did not become healthy.\n' >&2
  exit 1
fi

if grep -Fq -- "hostname: ${old_hostname}" "${config_file}" || grep -Fq -- "hostname: ${legacy_hostname}" "${config_file}"; then
  backup_config
  temp_file="$(mktemp /tmp/marosim-cloudflared-config.XXXXXX)"
  awk -v old_hostname="${old_hostname}" -v legacy_hostname="${legacy_hostname}" '
    BEGIN { remove_service = 0 }
    remove_service && $0 ~ /^[[:space:]]+service:[[:space:]]*/ {
      remove_service = 0
      next
    }
    {
      hostname = $0
      sub(/^[[:space:]]*-[[:space:]]+hostname:[[:space:]]*/, "", hostname)
      sub(/[[:space:]]*$/, "", hostname)
      if (hostname == old_hostname || hostname == legacy_hostname) {
        remove_service = 1
        next
      }
      print
    }
  ' "${config_file}" > "${temp_file}"
  install -m 600 -- "${temp_file}" "${config_file}"
  config_changed=1
  cloudflared tunnel ingress validate --config "${config_file}"
  systemctl --user restart "${service_name}"
  curl --fail --silent --max-time 5 "https://${new_hostname}/api/health" >/dev/null
fi

if [[ -n "${temp_file}" && -f "${temp_file}" ]]; then
  rm -f -- "${temp_file}"
fi
trap - ERR
printf '%s\n' "${new_health}"
printf 'Marosim is available at https://%s; dev hostnames were removed from tunnel ingress.\n' "${new_hostname}"
