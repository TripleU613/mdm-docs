# Network tab

## Overview
- Legacy VPN features (Enable VPN, Block All, Domain Whitelist) are ignored when Premium VPN is active.
- Domain Whitelist disables Private DNS and the main VPN toggle while it is on.
- Block All Traffic requires the legacy VPN and is disabled while whitelist or premium VPN is active.
- Master offline switches (premium only):
  - `network.vpn_offline_non_chrome` cuts all VPN/Squid traffic for the device.
  - `network.chrome_offline` cuts Chrome/MITM traffic.
  - Values are sent to Directus via the portal and enforced on the server; Android only reflects the setting.

- [Disable tethering and hotspot](./disable-tethering-and-hotspot)
- [Block Wi-Fi](./block-wi-fi)
- [Block all traffic](./block-all-traffic)
- [Enable private DNS](./enable-private-dns)
- [Enable VPN firewall (regular VPN, not VPN2)](./enable-vpn-firewall-regular-vpn-not-vpn2)
- [Whitelist domains (regular VPN, not VPN2)](./whitelist-domains-regular-vpn-not-vpn2)
