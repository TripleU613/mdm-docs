# VPN + proxies (WireGuard)

Scope: Android app behavior plus kvylock server stack (WireGuard + MITM + Directus).

## Connections
- Firebase control plane: `firestore-config`.
- Website admin UI (VPN tab + appeals): `website`.
- Directus schema + ops: `directus`.

## Traffic paths (Chrome vs rest)
- Chrome uses an explicit proxy only when premium VPN is active:
  - Proxy target: `http://10.9.0.1:8080`.
  - Enforced by Chrome app restrictions (SafeSearch + QUIC/DoH off).
- The proxy connection itself travels inside the WireGuard tunnel (Chrome still uses the VPN path).
- All other apps stay inside the WireGuard tunnel and are not sent to the MITM proxy.
- Squid is the domain/SNI blocker for VPN traffic:
  - Deny-list only (no TLS decrypt).
  - Uses DNS/ipset + firewall rules to block domains.
- MITM proxy is for Chrome-only, explicit-proxy traffic.
- Result:
  - Chrome -> WireGuard -> MITM proxy -> Internet.
  - Other apps -> WireGuard -> Squid/dnsmasq domain blocks -> Internet.

### Master offline switches (kill switches)
- Sources:
  - Website config keys: `network.chrome_offline`, `network.vpn_offline_non_chrome`.
  - Cloud Function `syncMasterOfflineFlagsDirectus` mirrors them into Directus `vpn_master_controls`.
- Enforcement:
  - Squid sync reads `vpn_master_controls` and emits `http_access deny <device>` when either flag is true (Chrome or VPN paths both cut).
  - MITM policy also checks `chrome_offline` and blocks Chrome outright.
- Propagation:
  - Website Save writes the flags; Squid applies on its next sync (~30s or manual `/opt/squid-blocklist/sync.py`).

### Sync/refresh cadence
- Squid blocklists + master flags: `squid-blocklist-sync.timer` (~30s). Manual: `/opt/squid-blocklist/sync.py`.
- Adblock source: `oisd-sync.timer` (daily) fetches OISD Full into Squid.
- ipset TTL: entries expire after `SQUID_IPSET_TIMEOUT` (default 86400s); removals can lag until expiry.

## Where it lives
- `app/src/main/java/com/tripleu/vpn2/Vpn2RemoteWatcher.kt`
- `app/src/main/java/com/tripleu/vpn2/Vpn2WireGuardManager.kt`
- `app/src/main/java/com/tripleu/vpn2/Vpn2State.kt`
- `app/src/main/java/com/tripleu/vpn/VpnPermissionHelper.kt`
- `app/src/main/java/com/tripleu/TripleUApp.kt`

## When it runs
- `Vpn2RemoteWatcher.start(...)` runs during deferred app startup and on boot.
- `PeriodicTaskRunner` calls `Vpn2RemoteWatcher.tick()` every ~5s.
- It attaches a Firestore listener on `devices/{deviceId}` and also applies on each tick.

## Gating (must be true)
- `ConfigStore` flag `network.premium_vpn_enabled=true`.
- `devices/{deviceId}.vpn` contains:
  - `active=true`
  - `stripeSubscriptionId` not empty
  - `expiresAtMs` in the future
  - `wgAddress`, `wgPort`, `wgServerPublicKey` present
- If any gate fails, WireGuard is stopped (or never started) and Always-On lockdown is cleared.

## Firestore fields used/written
- Read from `devices/{deviceId}.vpn`:
  - `active`, `expiresAtMs`, `stripeSubscriptionId`
  - `wgAddress`, `wgPort`, `wgServerPublicKey`
  - `wgEndpoint` (optional; default `vpn.kvylock.com`)
  - `wgDns` (optional)
  - `wgPublicKey` (optional)
- Write:
  - `vpn.wgPublicKey` (uploaded when missing or outdated).

## Key handling
- Generates a WireGuard keypair locally.
- Stores the private key in prefs `vpn2_state.wg_private_key`.
- Uploads the public key to Firestore for provisioning.

## VPN permission + lockdown
- Uses `VpnPermissionHelper.ensureVpnPermission(..., enableIntent=true, lockdown=true)`.
- If VPN consent is not already granted, WireGuard does not start.
- When active, it sets Always-On VPN with lockdown via DPM.

## Tunnel config
- Uses WireGuard GoBackend.
- Interface:
  - address `wgAddress/32`
  - DNS from `wgDns`, or derived from address (x.x.x.1).
- Peer:
  - endpoint `${wgEndpoint}:${wgPort}`
  - server public key `wgServerPublicKey`
  - allowed IPs `0.0.0.0/0, ::/0`.

## Blocked apps interaction
- Reads prefs `firewall_rules` and passes those packages as excluded apps.
- Excluded apps bypass the WireGuard tunnel (confirm desired behavior for premium VPN).

## Legacy VPN interaction
- `Vpn2State.shouldBlockLegacy(...)` is true when premium is enabled or active.
- The watcher stops `PcapVpnService` before starting WireGuard.
- Legacy VPN toggles are skipped while premium is active.

## MITM CA install (app side)
- If device owner, installs CA certs from assets:
  - `app/src/main/assets/kvylock.pem`
  - `app/src/main/assets/mitmproxy-ca.pem`
- Stores SHA-256 fingerprints in `vpn2_state` to avoid re-installing.

## Server (kvylock)
### Core services
- WireGuard: `wg-quick@wg-mitm` with config `/etc/wireguard/wg-mitm.conf`.
- VPN API: `api-http.service` runs `/opt/api/server.py` on `127.0.0.1:8000`.
- Squid: `squid.service` provides the VPN intercept proxy on `3128/3129`.
- MITM proxy: `mitmproxy.service` runs `mitmweb` in explicit mode on `:8080` with web UI on `127.0.0.1:8081`.
- DNS: `dnsmasq` listens on `0.0.0.0:5353` for VPN clients.
- Directus: Docker `directus` on kvylock behind HAProxy (see `directus`).
- Nginx: TLS entrypoint for `vpn.kvylock.com` and `admin.tripleu.org`.

### Admin UIs
- `https://admin.tripleu.org/logs/`: MITM proxy web UI (basic auth).
- `https://admin.tripleu.org/squid/`: Squid GoAccess report (basic auth).
- `https://admin.tripleu.org/live/`: Live MITM log viewer (basic auth).
  - Shows live allow/deny/unknown markers and collapses repeated domains with a counter.

### WireGuard config + keys
- Interface: `wg-mitm` address `10.9.0.1/24`, listen port `51820`.
- Peer blocks are annotated with `# device:<id>` and `AllowedIPs = <ip>/32`.
- Keys live in `/etc/wireguard/keys` (`wg-mitm.key`, `wg-mitm.pub`, plus `wg-clean`/`wg-block`).
- Only `wg-mitm.conf` exists on the server (no `wg-clean`/`wg-block` configs present).
- Service state: `wg-quick@wg-mitm` is enabled; `wg show` lists peers and handshakes.
- Provisioning sync uses `wg-quick up` to ensure the interface, then `wg-quick strip` + `wg syncconf`.
- `SaveConfig` is `false` in `wg-mitm.conf`, so file edits are authoritative.

### VPN API (provisioning)
- Nginx route: `https://vpn.kvylock.com/api` -> `127.0.0.1:8000`.
- Auth: expects `x-api-key` matching `API_KEY` in `/opt/api/api.env`.
- Tasks:
  - `wg_upsert` writes a `# device:<id>` block into `wg-mitm.conf`, then `wg syncconf`.
  - `wg_remove` removes the block and syncs the interface.
- Endpoints:
  - `GET /` returns `status: ok` without auth.
  - `POST /` requires auth and JSON body.
- Request fields:
  - `task` is `wg_upsert` or `wg_remove`.
  - `id` is required for both tasks.
  - `publicKey` and `address` are required for `wg_upsert`.
  - `mode` defaults to `mitm` (only `mitm` is configured).
- Responses are JSON with `status` (`success` or `failure`) and an `error` string on failure.
- Logs: `/opt/api/log.txt`.

### Squid proxy (intercept)
- Config:
  - `/etc/squid/squid.conf` (`http_port 3128 intercept`).
  - `/etc/squid/conf.d/tripleu-mdm.conf` (allow `10.9.0.0/24`).
  - `/etc/squid/conf.d/tripleu-ssl.conf` (TLS intercept + ssl-bump).
  - `/etc/squid/conf.d/goaccess.conf` (GoAccess log format).
  - `/etc/squid/conf.d/tripleu-host-verify.conf` (`host_verify_strict off` to avoid SNI/IP mismatch blocks).
  - `/etc/squid/conf.d/tripleu-dns.conf` (forces DNS to `1.1.1.1/1.0.0.1` to match client resolution).
- Blocklist:
  - Per-list files (HTTP URL regex + HTTPS domains):
    - `/etc/squid/blocklists/maps-urls.txt` + `/etc/squid/blocklists/maps-domains.txt`
    - `/etc/squid/blocklists/gifs-urls.txt` + `/etc/squid/blocklists/gifs-domains.txt`
    - `/etc/squid/blocklists/adblock-urls.txt` + `/etc/squid/blocklists/adblock-domains.txt`
    - `/etc/squid/blocklists/general-urls.txt` + `/etc/squid/blocklists/general-domains.txt`
    - `/etc/squid/blocklists/app_urls-urls.txt` + `/etc/squid/blocklists/app_urls-domains.txt`
  - Behavior: deny only; everything else is allowed.
  - Source:
    - Directus collections `maps`, `gifs`, `squid-general_block` (field `url`).
    - `app_urls` (field `urls`).
    - Any Directus collection in the `apps` group (one list per collection; uses `url` or `urls`).
  - Per-device toggles: Directus `vpn_squid_prefs` (default enabled; only disabled lists are stored).
  - Device mapping: `/etc/wireguard/wg-mitm.conf` uses `# device:<id>` comments with `AllowedIPs` for IP rules.
  - Sync: `squid-blocklist-sync.timer` (runs every 30 seconds).
  - Expect up to ~30s for new entries/toggles to take effect; removals can lag due to ipset TTL.
  - Sync script: `/opt/squid-blocklist/sync.py` (auth uses Directus admin in `/opt/directus/.env`).
  - Ad Block source: `/opt/squid-blocklist/lists/oisd-full.txt` (OISD Full), synced daily by `oisd-sync.timer`.
  - `maps` is informational only (no per-app routing); entries are enforced per-device.
  - Entry rules:
    - `example.com` -> domain block (SNI/dstdomain).
    - `||example.com^` -> domain block (Adblock-style).
    - `0.0.0.0 example.com` -> domain block (hosts-file style).
    - `http://example.com/path` or `example.com/path` -> HTTP URL block only.
    - HTTPS URL paths cannot be blocked without MITM; only the domain is used.
  - Squid ACLs (generated): `/etc/squid/conf.d/10-tripleu-device-blocklists.conf`.
  - DNS/ipset:
    - `/etc/dnsmasq.d/squid-blocklist.conf` maps domains into ipsets.
    - ipsets per list: `squid_maps`, `squid_gifs`, `squid_adblock`, `squid_general`, `squid_app_urls` (+ `*6` for IPv6).
    - ipset entries expire after 86400s (set by `SQUID_IPSET_TIMEOUT`); removals can take up to the timeout.
    - HTTPS blocks are enforced in iptables per device using the list ipsets (no Squid intercept).
    - `squid-ipset.service` ensures the ipsets exist at boot.
- Ports:
  - `3128` HTTP intercept.
  - `3129` HTTPS intercept (`ssl-bump` + generated certs).
  - `127.0.0.1:3127` local forward-proxy port (needed by Squid for bumping).
- TLS behavior:
  - `ssl_bump peek step1`, then `splice all` (no decrypt).
- Certs:
  - CA cert/key: `/etc/squid/ssl_cert/squid-ca.pem`.
  - SSL DB: `/var/lib/squid/ssl_db`.
- Logs:
  - GoAccess log file: `/var/log/squid/access-goaccess.log`.
- Log UI (GoAccess):
  - Service: `goaccess-squid.service`.
  - Output: `/opt/goaccess/squid.html`.
  - WebSocket: `127.0.0.1:8090` (proxied at `/squid/ws`).
- URL: `https://admin.tripleu.org/squid/` (basic auth; same as `/logs`).

### MITM proxy
- Explicit proxy on `0.0.0.0:8080` (clients must point to it).
- Input is limited to WireGuard clients (`10.9.0.0/24`).
- Web UI: `https://admin.tripleu.org/logs/` -> `127.0.0.1:8081` (Nginx basic auth).
- Certs: `/opt/mitmproxy/certs/mitmproxy-ca.pem` and `mitmproxy-dhparam.pem`.
- Runner: `/opt/blockers/runner.py` loads the blocker modules below.
- Version: mitmproxy 12.2.0 in `/opt/mitmproxy-venv`.
- Directus defaults: blockers use `http://127.0.0.1:8055` and read `/opt/directus/.env` when `DIRECTUS_TOKEN` is not set.
- Service flags: `--mode regular`, `--showhost`, `--set confdir=/opt/mitmproxy/certs/`, `--set web_password=...`.
- SNI logging: `SNI_LOG_IPS=*` and `SNI_LOG_TTL=30` are set on the service.

#### Blocker modules
- Policy core: `/opt/blockers/policy.py`.
  - Pulls `website_categories`, `websites`, `bad_words` from Directus.
  - Caches rule sets for `WEBSITES_TTL` seconds.
  - Maps WireGuard client IP to `device:<id>` by parsing `wg-mitm.conf`.
  - Per-device cache for `vpn_category_prefs` and `vpn_site_overrides` for `DEVICE_POLICY_TTL` seconds.
  - WireGuard config path can be overridden by `WG_CONFIG_PATH`.
  - Match types: `contains`, `startswith`, `endswith`, `exact`, `wildcard`.
  - Visibility `report`, `extreme`, `security` forces block regardless of category prefs.
  - Site overrides can force allow or force block, and override image or word policy.
  - Rule evaluation checks blocked rules first, then allowed rules, otherwise status is unknown.
  - Category defaults are applied when no per-device prefs exist.
  - Word filtering replaces matched terms with asterisks in text responses.
- Website rules: `/opt/blockers/website-blocker/blocker.py`.
  - Uses Directus `website_categories`, `websites`, `bad_words`.
  - Blocked pages show a local appeal portal at `/.kvylock/appeal`.
  - Appeals write to Directus `website_appeals` and `vpn_appeals`.
  - Word filter masks text in HTML/JS/JSON responses.
  - Portal links use `PORTAL_HOST` when set, otherwise relative paths.
  - Category lists are built from `visibility` and sorted by `sort_order`.
  - Categories list refresh uses `APPEAL_CATEGORIES_TTL`.
  - Unknown sites return a 451 page with "Request Review".
  - Blocked sites return a 451 page with "Appeal Access".
  - Non-HTML blocked requests are killed.
  - Portal modes: `appeal`, `review`, `report`.
  - Portal POSTs capture `url`, `host`, `reason`, and `device_id` when available.
  - Uses a hardcoded category list if Directus returns none.
- Image filter: `/opt/blockers/image-blocker/intercept.py`.
  - If policy enables image blocking, replaces images with transparent PNGs.
  - Global ignore list: `/opt/blockers/image-blocker/glob-ingone-hosts.txt`.
  - Parses PNG, GIF, JPEG, WebP sizes to keep dimensions when possible.
  - If parse fails, uses a 1x1 transparent PNG.
  - Cache and parse limits are controlled by `IMAGE_BLOCKER_CACHE` and `IMAGE_BLOCKER_PARSE_LIMIT`.
  - Current ignore list includes `kvylock.com` and `tripleu.com`.
- Search filter: `/opt/blockers/search-blocker/blocker.py`.
  - Blocks searches matching `bad-words.txt`.
  - Enforces Google SafeSearch by adding `safe=active`.
  - Only triggers on search hosts and query keys like `q`, `query`, `search`.
  - This list is local and separate from Directus `bad_words`.
- SNI blocker: `/opt/blockers/sni-blocker/blocker.py`.
  - Reads domains from Directus `mitm_block_domains.domain`.
  - Blocks at TLS/QUIC client hello (before MITM).
  - SNI logging is enabled in `mitmproxy.service` (`SNI_LOG_IPS=*`).
  - Sources can be overridden with `SNI_BLOCK_SOURCES`.
  - Cache TTL uses `SNI_BLOCK_TTL`.
  - Log throttling uses `SNI_LOG_TTL`.
  - Defaults to `mitm_block_domains:domain` when sources are not set.
- MITM ignore list: `/opt/blockers/mitm-ignore/blocker.py`.
  - Pulls `mitm_ignore_domains.domain` and merges into `ignore_hosts`.
  - Resolves IPs unless `MITM_IGNORE_RESOLVE` is disabled.
  - Cache TTL uses `MITM_IGNORE_TTL`.

### Blocker environment knobs
- `DIRECTUS_URL`, `DIRECTUS_ENV`, `DIRECTUS_TOKEN` (shared across blockers).
- `WEBSITES_TTL`, `DEVICE_POLICY_TTL`, `WG_CONFIG_PATH` (policy core).
- `APPEAL_CATEGORIES_TTL`, `PORTAL_HOST` (portal behavior).
- `SNI_BLOCK_TTL`, `SNI_BLOCK_SOURCES`, `SNI_BLOCK_COLLECTION`, `SNI_BLOCK_FIELD`, `SNI_LOG_IPS`, `SNI_LOG_TTL` (SNI blocker).
- `MITM_IGNORE_TTL`, `MITM_IGNORE_RESOLVE` (MITM ignore list).
- `IMAGE_BLOCKER_CACHE`, `IMAGE_BLOCKER_PARSE_LIMIT` (image blocker).

### MITM portal UX flow
- Path: `/.kvylock/appeal` served by the MITM proxy.
- Entry points:
  - Unknown site: 451 "Site Not Reviewed" page with "Request Review".
  - Blocked site: 451 "Site Blocked" page with "Appeal Access".
- GET parameters: `url`, `host`, `mode`, optional `category_id`.
- Modes:
  - `appeal`: access request (default).
  - `review`: request a category for an unknown site.
  - `report`: report a site that should be blocked.
- Form fields: hidden `url`, `host`, `mode`, optional `category_id`, optional `reason`.
- Category lists:
  - Uses Directus categories by `visibility` (`public`, `more`, `report`).
  - Falls back to a hardcoded list when Directus returns none.
- POST behavior:
  - `review` and `report` require a category selection; missing category returns a 400 result page.
  - `appeal` writes to `vpn_appeals` (includes `device_id` when a WG IP maps to a device).
  - `review` and `report` write to `website_appeals`.
- Success and error both return a simple HTML result page.

### Portal HTML templates (copy + layout)
- Shared layout:
  - Single centered card on a light gray background.
  - Heading, short description, and a URL display block.
  - Buttons are blue with white text.
- "Site Not Reviewed" block page:
  - Title: "Site Not Reviewed".
  - Message: "This website has not been reviewed yet."
  - Action: "Request Review" button.
- "Site Blocked" block page:
  - Title: "Site Blocked".
  - Message: "This website is blocked because it is in the category name shown by policy."
  - Action: "Appeal Access" button.
- Appeal form page (mode switch):
  - `appeal`: title "Appeal Access", description "Request access to this website."
  - `review`: title "Request Review", description "Suggest a category for this website."
  - `report`: title "Report Website", description "Report a website you believe should be blocked."
  - Category dropdown label: "Select a category".
  - Reason label: "Reason (optional)".
  - Reason placeholder: "Tell us why this site should be allowed..."
  - Submit button: "Submit".
- Result page:
  - Title is "Submitted" or "Error".
  - Message uses the server response text.

### DNS + firewall
- HTTP redirect: iptables sends TCP 80 -> `3128` for `10.9.0.0/24`.
- HTTPS blocklist: iptables chain `SQUID_BLOCKLISTS` rejects TCP 443 per device when destination matches list ipsets.
- DNS redirect: iptables sends TCP/UDP 53 from `10.9.0.0/24` to `:5353`.
- DNS upstream: `dnsmasq` uses `1.1.1.1` and `1.0.0.1` (`/etc/dnsmasq.d/kvylock-safesearch.conf`).
- Port `5353` is only accepted from `10.9.0.0/24` and localhost; other sources are dropped.
- SafeSearch override list is empty in the current dnsmasq config file.
- DoT blocked: iptables drops TCP/UDP 853 for `10.9.0.0/24`.
- UDP 443 from VPN clients is rejected (QUIC block).
- NAT: `10.9.0.0/24` is masqueraded out `eth0`.
- iptables restore: `/etc/iptables/rules.v4` loaded by `iptables-restore.service` at boot.

### Traffic path (current)
- VPN client connects to WireGuard `wg-mitm`.
- TCP 80 is redirected to Squid (`3128`) for HTTP URL blocking.
- TCP 443 goes direct unless the destination is in the Squid blocklist (then it is rejected).
- Chrome (premium VPN active) uses explicit proxy `10.9.0.1:8080` to `mitmproxy`.
- DNS requests hit `dnsmasq` on `:5353` before leaving the box.
- QUIC and DNS-over-TLS are blocked to keep traffic on TCP and DNS on `dnsmasq`.

### Nginx routes
- `vpn.kvylock.com/api` -> local VPN API.
- `admin.tripleu.org/directus/` -> HAProxy -> Directus (basic auth).
- `admin.tripleu.org/logs/` -> mitmweb UI (basic auth; adds an Authorization header in Nginx config).
- `admin.tripleu.org/squid/` -> Squid log UI (basic auth).
- `admin.tripleu.org/live/` -> Live MITM logs UI (basic auth).
- Basic auth file: `/etc/nginx/htpasswd-mitmweb` (user `tripleu`, PIN `Aa45301826`).

## Request map (server side)
- Firebase `onDeviceWrite` calls the VPN API to upsert WireGuard peers.
- VPN API edits `wg-mitm.conf` and syncs the WireGuard interface.
- MITM policy pulls Directus rules, categories, bad words, and device overrides.
- MITM portal writes `vpn_appeals` and `website_appeals`.
- Website writes Directus category prefs and site overrides.
- Appeal approver promotes approved `website_appeals` into `websites`.
- MITM maps WG client IPs back to `device:<id>` via `wg-mitm.conf`.

## Cross-system flow (end-to-end)
- Android writes `vpn.wgPublicKey` and reads `devices/{deviceId}.vpn` for WG details.
- Firebase functions allocate WG address/keys and call the kvylock VPN API.
- VPN API updates WireGuard peers; MITM uses WG IP -> device id mapping.
- Website writes Directus category prefs and site overrides; MITM enforces them.

## Related services on kvylock
### TURN (remote control)
- Service: `coturn.service` on `kvylock`.
- Config: `/etc/turnserver.conf`.
- Ports: `3478` (STUN/TURN) and `5349` (TLS).
- Realm and external IP are set in the config; credentials use long-term auth.
- Logs: `/var/log/turnserver.log` and `/var/tmp/turn_*.log`.
- Used by the website Remote Control and by Firebase functions that return TURN config.
