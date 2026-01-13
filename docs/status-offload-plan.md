# Status Offload Plan (admin.tripleu.org/status -> witness)

Status: executed on 2026-01-13.

## Objective
Move the `/status/` page (Gatus) off **kvylock** and run it on **witness**, while keeping the public URL the same.

## Changes Applied (2026-01-13)
- Installed Docker on **witness**.
- Copied Gatus config + DB to `/opt/gatus` on **witness**.
- Updated witness Gatus TCP targets to `159.65.173.60` for 3128/3129/8080.
- Started `gatus` on **witness** with `0.0.0.0:3003 -> 8080`.
- Added Nginx upstream `gatus_status` on **kvylock** (witness primary, local backup).
- Allowed **witness** IP `167.71.110.240` to reach kvylock `:8080` (iptables + rules.v4).

## Current State (kvylock)

### Nginx route
File: `/etc/nginx/sites-enabled/admin-tripleu-admin`

```
location /status/ {
    proxy_pass http://gatus_status/;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header Accept-Encoding "";

    sub_filter_types text/html text/javascript application/javascript;
    sub_filter_once off;
    sub_filter 'href="/' 'href="/status/';
    sub_filter 'src="/' 'src="/status/';
    sub_filter '/api/v1/' '/status/api/v1/';
    sub_filter 'history:(0,i.PO)("/")' 'history:(0,i.PO)("/status/")';
    sub_filter 's.p="/"' 's.p="/status/"';
}
```

### Gatus container (local backup)
- Container: `gatus` (image `twinproduction/gatus:latest`)
- Port: `127.0.0.1:3003 -> 8080`
- Restart policy: `unless-stopped`
- Config: `/opt/gatus/config.yaml`
- Data: `/opt/gatus/data/gatus.db`

### Gatus config (current local)
- Storage: sqlite at `/data/gatus.db`
- Endpoints include:
  - `tcp://172.17.0.1:3128`
  - `tcp://172.17.0.1:3129`
  - `tcp://172.17.0.1:8080`
  - `https://admin.tripleu.org/logs/`
  - `https://admin.tripleu.org/`
  - `https://admin.tripleu.org/docs/`
  - `https://admin.tripleu.org/directus/`
  - `https://admin.tripleu.org/squid/`
  - `https://admin.tripleu.org/live/`

Note: the `172.17.0.1` addresses are Docker host-local on kvylock and only apply to the local backup container.

## Witness State (after change)
- Host: `witness` (Debian 13)
- Public IP: `167.71.110.240`
- Private IPs: `10.17.0.6/16`, `10.108.0.3/20`
- Docker: installed
- Gatus: running on `0.0.0.0:3003`
- TCP checks use kvylock public IP `159.65.173.60`
- Connectivity to kvylock public ports:
  - `3128`: OK
  - `3129`: OK
  - `8080`: OK (whitelisted)

## Target State
- Gatus runs on **witness**.
- `admin.tripleu.org/status/` still served by kvylock Nginx, but proxies to witness.
- No app/web/firebase changes.

## Networking Notes
- Private 10.17.0.0/16 routing did not work; public IP is used.
- kvylock INPUT rule added to allow `167.71.110.240:8080`.

## Verification (completed)
- `curl -k -I --resolve admin.tripleu.org:443:127.0.0.1 https://admin.tripleu.org/status/` -> 200 on kvylock
- `curl -I http://167.71.110.240:3003/` -> 200

## Open Items / Optional
- Optional: restrict witness `:3003` to kvylock IP only.
- Optional: fix private routing so public IP is not required.
- Decide whether to keep local gatus as a long-term fallback.
