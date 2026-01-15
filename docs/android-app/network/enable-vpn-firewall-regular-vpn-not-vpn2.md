# Enable VPN firewall (regular VPN, not VPN2)

## Where it lives
- `app/src/main/java/com/tripleu/ui/fragments/PrivacyFragment.kt`
- `app/src/main/java/com/tripleu/vpn/PcapVpnService.kt`
- `app/src/main/java/com/tripleu/vpn/VpnPermissionHelper.kt`
- `app/src/main/java/com/tripleu/vpn/Command.java`
- `app/src/main/java/com/tripleu/policy/PolicyManager.kt`
- `app/src/main/java/com/tripleu/policy/VpnPolicyController.kt`
- `app/src/main/java/com/tripleu/network/FirewallManager.kt`
- `app/src/main/java/com/tripleu/config/ConfigPoller.kt`

## What it does
- Starts/stops the main firewall VPN (`PcapVpnService`).
- Sets Always-On VPN and blocks VPN settings changes.
- Stores `is_vpn_on` (prefs) and `network.vpn_enabled` (`ConfigStore`).
- Powers per-app network blocking via the `firewall_rules` prefs.
- Skips all legacy VPN behavior when premium VPN (WireGuard) is active.
- No MITM: this VPN is device-local filtering and does not proxy Chrome.

## How it runs
- Toggle on calls `startStopService(true)`:
  - Requires all setup permissions; otherwise redirects to `PermissionsCheckActivity`.
  - Requests VPN consent if needed (`VpnService.prepare`).
  - On success, sets Always-On VPN, applies `UserManager.DISALLOW_CONFIG_VPN`, and starts `PcapVpnService` with `Command.START`.
- Toggle off stops `PcapVpnService` and removes Always-On + `DISALLOW_CONFIG_VPN`.
- `persistAutoStartFlag()` writes `config.autoStart` when VPN or whitelist is enabled.
- Cloud config `network.vpn_enabled` is applied in `ConfigPoller` unless `Vpn2State.shouldBlockLegacy(...)` is true.

## How app network blocking works
- Normal firewall mode (no block-all, no per-app rules):
  - `PcapVpnService` captures traffic and allows it by default.
- Per-app network blocks are stored in `firewall_rules` (key = package name, value = true).
- `PcapVpnService` reads those keys and blocks matching UIDs.
- Whitelist/blacklist modes apply domain/URL decisions via `DomainFilter`.

## On boot
- `BootComplete` calls `checkStartPcapOnBoot(...)`.
- If `config.autoStart` is true, setup is complete, and VPN permission is granted:
  - Starts `PcapVpnService`.
- Legacy VPN is skipped if `Vpn2State.shouldBlockLegacy(...)` is true.
