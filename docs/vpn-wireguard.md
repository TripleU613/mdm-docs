# VPN + MITM proxy (WireGuard)

Scope: WireGuard VPN and the MITM proxy that rides on the same stack.

Known:
- Server: `kvylock` (SSH)
- Device cert assets: `app/src/main/assets/kvylock.pem`, `app/src/main/assets/mitmproxy-ca.pem`

MITM proxy:
- Purpose: inspect/block traffic via installed CA certs.
- Location: same `kvylock` host as the VPN.

TBD:
- Endpoints/ports
- Key handling
- Client config
- Ops
