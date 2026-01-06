# Import profile

## Where it lives
- `app/src/main/java/com/tripleu/ui/fragments/SettingsFragment.kt`
- `app/src/main/java/com/tripleu/config/ProfileBackupManager.kt`
- `app/src/main/java/com/tripleu/config/ConfigStore.kt`

## What it does
- Imports a previously exported profile file.
- Applies settings into `ConfigStore` and shows how many were applied.
- Applies per-app policy flags included in the profile.
- Warns if VPN consent is missing after a profile enables VPN or whitelist.

## How it runs
- `importProfileLauncher` uses `OpenDocument()` and accepts `application/octet-stream` and `*/*`.
- `ProfileBackupManager.import()`:
  - Decrypts the file and parses the JSON array.
  - Skips entries with blank keys or keys containing `pin` or `auth`.
  - Applies values based on `type` (`bool`, `int`, `long`, `json`, `string`).
  - Applies `apps[]` policy flags (hide/suspend/uninstall/network/webview/video + approved).
  - Writes app snapshots to Firestore via `AppSnapshotStorage`.
  - Restarts the main VPN if any imported app is `networkBlocked`.
- On success, `maybeNotifyMissingVpnConsent()` checks:
  - `network.vpn_enabled` or `network.domain_whitelist_enabled` in `ConfigStore`.
  - If enabled but VPN permission is missing, it shows a toast.
