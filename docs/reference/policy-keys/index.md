# Policy Keys

This page lists key names used in the current config and app snapshot flow.

## Device Config Keys (Core)

| Key | Type | Notes |
| --- | --- | --- |
| `apps.block_new_apps` | bool | Blocks new app activation until approved. |
| `apps.allow_user_updates` | bool | Allows user-driven updates path. |
| `apps.available_packages` | json | Store-request available list. |
| `apps.requested_packages` | json | Store-request queue. |
| `apps.approved` | json | Approved package list. |
| `apps.known_installed` | json | Known installed package list. |
| `time_management.enabled` | bool | Global time management switch. |
| `system.*` restrictions | bool | Device-owner restrictions (calls/sms/install/etc). |
| `accessibility.*` toggles | bool/string | App UI-surface blockers and Android Auto quirk mode. |
| `network.vpn_enabled` | bool | Enables PCAP network service path. |
| `network.vpn_app_mode` | string | `include` or `exclude`. |
| `network.block_all_traffic` | bool | Cut traffic mode (with VPN path). |
| `network.domain_whitelist_enabled` | bool | Host whitelist mode. |
| `network.domain_whitelist_hosts` | json | Host allow list data. |
| `network.domain_blacklist_enabled` | bool | Host blacklist mode. |
| `network.domain_blacklist_hosts` | json | Host deny list data. |
| `network.private_dns_enabled` | bool | Private DNS policy toggle. |
| `network.private_dns_hostname` | string | Private DNS hostname. |
| `kiosk.*` keys | bool/string/json | Kiosk enablement, behavior flags, allowed packages. |
| `settings.language` | string | App language override. |
| `settings.app_density_percent` | int | UI density scaling. |
| `auth.pin_sha256` | string | Stored auth PIN hash. |
| `updates.muted_packages` | json | Muted update package list. |

## App Snapshot Fields (`apps/{package}`)

| Field | Type | Meaning |
| --- | --- | --- |
| `hidden` | bool | App hidden by policy. |
| `suspended` | bool | App suspended by policy. |
| `disabled` | bool | App disabled by policy. |
| `jumpOut` | bool | Forced jump-out policy active. |
| `uninstallBlocked` | bool | Uninstall blocked flag. |
| `networkBlocked` | bool | App network block flag. |
| `webviewBlocked` | bool | WebView blocklist flag. |
| `webviewException` | bool | WebView exception flag. |
| `vpnExcluded` / `vpnIncluded` | bool | VPN package mode membership. |
| `kioskAllowed` | bool | Included in kiosk allowlist. |
| `timeControlled` | bool | Time policy exists for this app. |
| `timePolicy` | object | Serialized schedule/countdown policy. |
| `managed` | bool | Derived true when any control is active. |
| `updatedAtMs` | number | Last snapshot update timestamp. |
| `source` | string | Writer source (`device` or `admin`). |

## Transition Keys

| Key | Status |
| --- | --- |
| `network.premium_vpn_enabled` | Deprecated; migrated to legacy PCAP defaults. |
| `network.vpn_offline_non_chrome` | Legacy website/offline sync path. |
| `network.chrome_offline` | Legacy website/offline sync path. |

## Source of Truth

- Website config schema: `TripleUMDM_New_Website/app/components/dashboard/constants.ts`
- Android config apply path: `TripleUMDM/app/src/main/java/com/tripleu/config/ConfigPoller.kt`
- App snapshot writer: `TripleUMDM/app/src/main/java/com/tripleu/config/AppSnapshotStorage.kt`
