# Disable app settings control

## Where it lives
- `app/src/main/java/com/tripleu/ui/fragments/PrivacyFragment.kt`
- `app/src/main/java/com/tripleu/ui/privacy/SystemToggleHandler.kt`
- `app/src/main/java/com/tripleu/policy/PolicyManager.kt`
- `app/src/main/java/com/tripleu/policy/UserRestrictionController.kt`

## What it does
- Applies `UserManager.DISALLOW_APPS_CONTROL`.
- Persists `system.apps_control_blocked` in `ConfigStore`.

## How it runs
- Toggle in `PrivacyFragment` calls `SystemToggleHandler.onAppsControlToggle`.
- That calls `PolicyManager.toggleUserRestriction(...)`.
- Requires device owner (enforced by `DeviceOwnerActionExecutor`).
