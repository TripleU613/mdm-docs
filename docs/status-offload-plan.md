# Status Offload Plan (admin.tripleu.org/status -> witness)

Status: executed on 2026-01-13.

## Objective
Move the `/status/` page (Gatus) off **kvy** (formerly kvylock) and run it on **witness**, while keeping the public URL the same.

## Changes Applied (2026-01-13)
- Installed Docker on **witness**.
- Copied Gatus config + DB to `/opt/gatus` on **witness**.
- Updated witness Gatus TCP targets to `194.26.223.216` for 3128/3129/8080.
- Started `gatus` on **witness** with `0.0.0.0:3003 -> 8080`.
- Added Nginx upstream `gatus_status` on **kvy** (witness primary).
- Removed the local Gatus container on **kvy** (witness only).
- Removed the Spaces health check from Gatus.

## Current State (kvy)

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

### Gatus container
- Runs only on **witness** (no local container on kvy).

### Gatus config (witness)
- Storage: sqlite at `/data/gatus.db`
- Endpoints include:
  - `tcp://194.26.223.216:3128`
  - `tcp://194.26.223.216:3129`
  - `tcp://194.26.223.216:8080`
  - `https://admin.tripleu.org/`
  - `https://admin.tripleu.org/directus/`
  - `tcp://167.71.110.240:22`

## Witness State (after change)
- Host: `witness` (Debian 13)
- Public IP: `167.71.110.240`
- Private IPs: `10.17.0.6/16`, `10.108.0.3/20`
- Docker: installed
- Gatus: running on `0.0.0.0:3003`
- TCP checks use kvy public IP `194.26.223.216`
- Connectivity to kvy public ports:
  - `3128`: OK
  - `3129`: OK
  - `8080`: OK (whitelisted)

## Target State
- Gatus runs on **witness**.
- `admin.tripleu.org/status/` still served by kvy Nginx, but proxies to witness.
- No app/web/firebase changes.

## Networking Notes
- Private 10.17.0.0/16 routing did not work; public IP is used.
- kvy INPUT rule added to allow `167.71.110.240:8080`.

## Verification (completed)
- `curl -k -I --resolve admin.tripleu.org:443:127.0.0.1 https://admin.tripleu.org/status/` -> 200 on kvy
- `curl -I http://167.71.110.240:3003/` -> 200

## Open Items / Optional
- Optional: restrict witness `:3003` to kvy IP only.
- Optional: fix private routing so public IP is not required.
