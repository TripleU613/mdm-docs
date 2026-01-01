# VPN + MITM proxy (WireGuard)

Scope: Android app behavior for the premium WireGuard VPN (VPN2) and MITM CA install.

## Where it lives
- `app/src/main/java/com/tripleu/vpn2/Vpn2RemoteWatcher.kt`
- `app/src/main/java/com/tripleu/vpn2/Vpn2WireGuardManager.kt`
- `app/src/main/java/com/tripleu/vpn2/Vpn2State.kt`
- `app/src/main/java/com/tripleu/vpn/VpnPermissionHelper.kt`
- `app/src/main/java/com/tripleu/TripleUApp.kt`

## When it runs
- `Vpn2RemoteWatcher.start(...)` runs during deferred app startup.
- It attaches a Firestore listener on `devices/{deviceId}` and also polls every ~5s.

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
- The watcher stops `AdVpnService` and `WhitelistVpnService` before starting WireGuard.
- Legacy VPN toggles are skipped while premium is active.

## MITM CA install (app side)
- If device owner, installs CA certs from assets:
  - `app/src/main/assets/kvylock.pem`
  - `app/src/main/assets/mitmproxy-ca.pem`
- Stores SHA-256 fingerprints in `vpn2_state` to avoid re-installing.

## Unknowns
- Server-side proxy endpoints/ports are not in the app code.
