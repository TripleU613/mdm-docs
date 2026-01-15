# Block all traffic

## Where it lives
- `app/src/main/java/com/tripleu/ui/fragments/PrivacyFragment.kt`
- `app/src/main/java/com/tripleu/vpn/PcapVpnService.kt`
- `app/src/main/java/com/tripleu/config/ConfigPoller.kt`

## What it does
- Forces a blocking VPN profile and disables mobile network config.
- Forces Wi-Fi block while active.

## How it runs
- Toggle is enabled only when the VPN firewall is running and whitelist/blacklist modes are off.
- Ignored when premium VPN (WireGuard) is active.
- Enabling shows a warning dialog, then `applyGlobalNetworkBlock(true)`:
  - Applies `UserManager.DISALLOW_CONFIG_MOBILE_NETWORKS`.
  - Sets `global_network_block_enabled` (prefs) and `Hawk` key `isBlockNetwork`.
  - Forces Wi-Fi block to true and refreshes `PcapVpnService`.
  - Writes `network.block_all_traffic` + `network.wifi_blocked` to `ConfigStore`.
- Disabling restores the saved Wi-Fi preference and refreshes `PcapVpnService`.
- `PcapVpnService` reads `isBlockNetwork` to apply the block.
- Cloud config `network.block_all_traffic` is applied in `ConfigPoller`.
