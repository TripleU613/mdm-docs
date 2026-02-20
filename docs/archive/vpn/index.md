# VPN Legacy Status (Archive)

Legacy VPN documentation is retained only for existing deployments that still expose old controls.

## Current Product Direction

- Active network enforcement is PCAP/local policy.
- WireGuard/premium VPN baseline is discontinued.
- Legacy pages are read-only guidance for migration support.

## Migration Guidance

1. Move policy ownership to `network.*` keys in current tabs.
2. Validate whitelist/blacklist/private DNS behavior on test devices.
3. Remove operational dependency on legacy VPN controls.
