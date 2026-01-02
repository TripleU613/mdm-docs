# MDM Docs

## Top-level systems
- Android app
- Website
- Firestore config
- VPN + MITM proxy (WireGuard) on `kvylock`
- Directus

## Quick map
- Cross-system map (Android + Website + Firebase): `firestore-config`.
- Android UI details: `android-app`.
- Website UI + flows: `website`.
- Server stack (VPN + MITM + Directus): `vpn-wireguard` and `directus`.

## Improvement goals
- Align Remote Control TURN usage (use `config/turn` or functions instead of hardcoded values).
- Remove or confirm legacy Firestore keys like `accessibility.block_webview`.
- Add a scheduled sync from SQLite sources to Directus Postgres (import scripts are manual).
- Add SafeSearch DNS overrides to `/etc/dnsmasq.d/kvylock-safesearch.conf` or rename the file.
- Decide whether `wg-clean`/`wg-block` keys should have configs or be removed.
- Unify bad-word sources (Directus `bad_words` vs local search blocker list).

## Issues spotted (current)
- Website Remote Control uses hardcoded TURN values and ignores `config/turn` and callable functions.
- `accessibility.block_webview` appears in Firestore keys but is not referenced elsewhere.
- App-only config keys `apps.approved` and `apps.known_installed` are not surfaced in the website UI.
- SafeSearch DNS config file has no `address=` overrides.
- `apps-graphql.service` is disabled; if used for policy editing, it is currently offline.
- Directus import scripts are manual; no scheduler is configured.
- `wg-clean`/`wg-block` keys exist but no configs are present.
- Email blocklist is split: Android reads RTDB `blockedEmails`, backend uses Firestore `bannedEmails`.
