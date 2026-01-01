# Block Wi-Fi

## Where it lives
- `app/src/main/java/com/tripleu/ui/fragments/PrivacyFragment.kt`
- `app/src/main/java/com/tripleu/policy/PolicyManager.kt`
- `app/src/main/java/com/tripleu/config/ConfigPoller.kt`

## What it does
- Applies `UserManager.DISALLOW_CONFIG_WIFI`.
- Stores `wifi_blocked` (prefs) and `network.wifi_blocked` (`ConfigStore`).

## How it runs
- Toggle calls `handleWifiToggle(...)` which applies the restriction and persists state.
- If "Block all traffic" is active, the toggle shows a warning and enforcement stays managed by the block-all flow.
- Cloud config `network.wifi_blocked` is applied in `ConfigPoller`.
