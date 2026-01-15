# MDM Docs

## Top-level systems
- Android app
- Website
- Firestore config
- VPN + MITM proxy (WireGuard) on `kvylock`
- Directus + Postgres (kvylock)
- Admin portal (`admin.tripleu.org`)
- Infra ops summary

## Quick map
- Cross-system map (Android + Website + Firebase): `firestore-config`.
- Android UI details: `android-app`.
- Website UI + flows: `website`.
- Server stack (VPN + MITM + Directus): `vpn-wireguard` and `directus`.
- Full infra/ops record: `infra-ops-summary`.
- Directus failover details (retired): `directus-failover-plan`.
- Status offload details: `status-offload-plan`.

## Servers (current roles)
- `kvylock`: public entrypoint, Nginx + HAProxy, WireGuard hub, MITM proxy, Squid, dnsmasq, Directus, Postgres.
- `witness`: Gatus (status) + etcd for Patroni.

## Improvement goals
- Add a scheduled sync from SQLite sources to Directus Postgres (import scripts are manual).
- Add SafeSearch DNS overrides to `/etc/dnsmasq.d/kvylock-safesearch.conf` or rename the file.
- Decide whether `wg-clean`/`wg-block` keys should have configs or be removed.
- Unify bad-word sources (Directus `bad_words` vs local search blocker list).

## Issues spotted (current)
- SafeSearch DNS config file has no `address=` overrides.
- `apps-graphql.service` is disabled; if used for policy editing, it is currently offline.
- Directus import scripts are manual; no scheduler is configured.
- `wg-clean`/`wg-block` keys exist but no configs are present.
- Directus/Postgres has no standby node right now.

*Last updated: 2026-01-13*
