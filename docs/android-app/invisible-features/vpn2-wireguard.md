# VPN2 WireGuard watcher

Where it lives:
- `app/src/main/java/com/tripleu/vpn2/Vpn2RemoteWatcher.kt`
- `app/src/main/java/com/tripleu/vpn2/Vpn2WireGuardManager.kt`
- `app/src/main/java/com/tripleu/vpn2/Vpn2State.kt`

What it does:
- Enables the premium WireGuard VPN when the portal allows it.
- Installs managed CA certs for VPN + MITM.
- Suspends legacy VPNs while VPN2 is active.

How it runs:
- Watches the device doc `devices/{deviceId}` for a `vpn` object.
- Requires `network.premium_vpn_enabled=true` plus:
  - `vpn.active=true`
  - valid `vpn.expiresAtMs`
  - non-empty WireGuard fields (`wgAddress`, `wgPort`, `wgServerPublicKey`).
- Generates/stores WireGuard private key in `vpn2_state` prefs.
- Uploads `vpn.wgPublicKey` if missing or outdated.
- Starts WireGuard with:
  - address `wgAddress/32`
  - endpoint `wgEndpoint` or `vpn.kvylock.com`
  - DNS from `wgDns` or derived from the address
  - excluded apps from `firewall_rules`.
- Installs CA certs from assets:
  - `kvylock.pem`
  - `mitmproxy-ca.pem`.
- Sets Always-On + lockdown while active.
