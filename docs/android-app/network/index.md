# Network tab

## Overview
- Firewall VPN (pcapdroid) features are ignored when Premium VPN is active.
- Whitelist/Blacklist modes run inside the Firewall VPN; Private DNS can stay on (DNS host is auto-allowed).
- Block All Traffic requires the Firewall VPN and is disabled while whitelist or premium VPN is active.
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
