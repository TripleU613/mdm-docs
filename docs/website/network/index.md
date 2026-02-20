# Network Tab (Website)

Network tab controls the active PCAP-based network policy path.

## Active Controls

- `network.vpn_enabled`
- `network.vpn_app_mode` (include/exclude)
- `network.block_all_traffic`
- `network.domain_whitelist_enabled`
- `network.domain_blacklist_enabled`
- `network.private_dns_enabled`

## Operational Notes

- Whitelist and blacklist modes are mutually exclusive.
- Block-all should only be used when VPN is active.
- Chrome SafeSearch enforcement is kept enabled by device policy.

## Legacy Note

Old WireGuard/premium VPN model is deprecated and documented only in [Archive VPN](/archive/vpn/).
