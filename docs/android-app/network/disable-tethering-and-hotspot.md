# Disable tethering and hotspot

## Where it lives
- `app/src/main/java/com/tripleu/ui/fragments/PrivacyFragment.kt`
- `app/src/main/java/com/tripleu/ui/privacy/SystemToggleHandler.kt`
- `app/src/main/java/com/tripleu/policy/PolicyManager.kt`
- `app/src/main/java/com/tripleu/config/ConfigPoller.kt`

## What it does
- Applies `UserManager.DISALLOW_CONFIG_TETHERING`.
- Persists `system.tethering_blocked` in `ConfigStore`.

## How it runs
- Toggle calls `SystemToggleHandler.onTetheringToggle(...)`.
- Cloud config `system.tethering_blocked` is applied in `ConfigPoller`.
