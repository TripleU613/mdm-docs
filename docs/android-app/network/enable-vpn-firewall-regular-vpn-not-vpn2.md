# Enable VPN firewall (regular VPN, not VPN2)

## Where it lives
- `app/src/main/java/com/tripleu/ui/fragments/PrivacyFragment.kt`
- `app/src/main/java/com/tripleu/vpn/AdVpnService.java`
- `app/src/main/java/com/tripleu/vpn/AdVpnThread.java`
- `app/src/main/java/com/tripleu/vpn/VpnPermissionHelper.kt`
- `app/src/main/java/com/tripleu/policy/PolicyManager.kt`
- `app/src/main/java/com/tripleu/network/FirewallManager.kt`
- `app/src/main/java/com/tripleu/config/ConfigPoller.kt`

## What it does
- Starts/stops the main firewall VPN (`AdVpnService`).
- Sets Always-On VPN and blocks VPN settings changes.
- Stores `is_vpn_on` (prefs) and `network.vpn_enabled` (`ConfigStore`).
- Powers per-app network blocking via the `firewall_rules` prefs.

## How it runs
- Toggle on calls `startStopService(true)`:
  - Stops `WhitelistVpnService` to avoid overlap.
  - Requires all setup permissions; otherwise redirects to `PermissionsCheckActivity`.
  - Requests VPN consent if needed (`VpnService.prepare`).
  - On success, sets Always-On VPN, applies `UserManager.DISALLOW_CONFIG_VPN`, and starts `AdVpnService` with `Command.START`.
- Toggle off stops `AdVpnService` and removes Always-On + `DISALLOW_CONFIG_VPN`.
- `persistAutoStartFlag()` writes `config.autoStart` when VPN or whitelist is enabled.
- Cloud config `network.vpn_enabled` is applied in `ConfigPoller` unless `Vpn2State.shouldBlockLegacy(...)` is true.

## How app network blocking works
- Normal firewall mode (no block-all, no per-app rules):
  - `AdVpnThread` only routes DNS servers through the VPN.
  - Non-DNS traffic stays outside the VPN.
- Per-app network blocks are stored in `firewall_rules` (key = package name, value = true).
- `AdVpnThread` reads those keys via `loadPerAppBlockedPackages()`.
- If the list is not empty and whitelist mode is off, it builds a "Selective VPN":
  - Adds default routes (`0.0.0.0/0` and `::/0`) so VPN captures all traffic.
  - Disallows every app except the blocked list (so only blocked apps go through the VPN).
  - The VPN thread only handles DNS packets; non-DNS packets are not forwarded.

## On boot
- `BootComplete` calls `AdVpnService.checkStartVpnOnBoot(...)`.
- If `config.autoStart` is true, setup is complete, and VPN permission is granted:
  - Starts `WhitelistVpnService` when `config.hosts.enabled=true`.
  - Otherwise starts `AdVpnService`.
- Legacy VPN is skipped if `Vpn2State.shouldBlockLegacy(...)` is true.
