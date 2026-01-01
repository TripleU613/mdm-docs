# Enable private DNS

## Where it lives
- `app/src/main/java/com/tripleu/ui/fragments/PrivacyFragment.kt`
- `app/src/main/java/com/tripleu/config/ConfigPoller.kt`

## What it does
- Sets Android Private DNS mode to a hostname.
- Defaults to `all.dns.mullvad.net` when the input is empty.
- Locks the setting with `UserManager.DISALLOW_CONFIG_PRIVATE_DNS`.
- Stores `network.private_dns_enabled` and `network.private_dns_hostname` in `ConfigStore`.

## Requirements
- Android 10+ (Q).
- `WRITE_SECURE_SETTINGS` permission.

## How it runs
- Toggle on opens the DNS dialog and calls `applyCustomDns(...)`:
  - Writes `Settings.Global` `private_dns_mode=hostname` and `private_dns_specifier`.
  - Stores `private_dns_set` + `custom_dns_server` in prefs and `Hawk.isPrivateDnsChecked`.
  - Locks the Private DNS setting.
  - Triggers `AdVpnService` refresh after ~3s if VPN is running.
- Toggle off clears the `Settings.Global` keys and removes the restriction + stored values.
- When whitelist mode is enabled, private DNS is forced off and the toggle is disabled.
- `AdVpnThread` skips DNS interception while Private DNS is on, unless whitelist mode is active.
