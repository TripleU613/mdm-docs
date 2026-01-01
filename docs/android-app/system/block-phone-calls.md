# Block phone calls

## Where it lives
- `app/src/main/java/com/tripleu/ui/fragments/PrivacyFragment.kt`
- `app/src/main/java/com/tripleu/ui/privacy/SystemToggleHandler.kt`
- `app/src/main/java/com/tripleu/policy/PolicyManager.kt`
- `app/src/main/java/com/tripleu/policy/UserRestrictionController.kt`

## What it does
- Applies `UserManager.DISALLOW_OUTGOING_CALLS`.
- Persists `system.calls_blocked` in `ConfigStore`.

## How it runs
- Toggle in `PrivacyFragment` calls `SystemToggleHandler.onCallsToggle`.
- That calls `PolicyManager.toggleUserRestriction(...)`.
- Requires device owner (enforced by `DeviceOwnerActionExecutor`).
