# Block all traffic

## Where it lives
- `app/src/main/java/com/tripleu/ui/fragments/PrivacyFragment.kt`
- `app/src/main/java/com/tripleu/vpn/AdVpnThread.java`
- `app/src/main/java/com/tripleu/config/ConfigPoller.kt`

## What it does
- Forces a blocking VPN profile and disables mobile network config.
- Forces Wi-Fi block while active.

## How it runs
- Toggle is enabled only when the VPN firewall is running and whitelist mode is off.
- Enabling shows a warning dialog, then `applyGlobalNetworkBlock(true)`:
  - Applies `UserManager.DISALLOW_CONFIG_MOBILE_NETWORKS`.
  - Sets `global_network_block_enabled` (prefs) and `Hawk` key `isBlockNetwork`.
  - Forces Wi-Fi block to true and refreshes `AdVpnService`.
  - Writes `network.block_all_traffic` + `network.wifi_blocked` to `ConfigStore`.
- Disabling restores the saved Wi-Fi preference and refreshes `AdVpnService`.
- `AdVpnThread` reads `isBlockNetwork` to build the blocking VPN interface.
- Cloud config `network.block_all_traffic` is applied in `ConfigPoller`.
