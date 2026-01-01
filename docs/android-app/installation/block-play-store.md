# Block Play Store

## Where it lives
- `app/src/main/java/com/tripleu/ui/fragments/PrivacyFragment.kt`
- `app/src/main/java/com/tripleu/ui/privacy/SystemToggleHandler.kt`
- `app/src/main/java/com/tripleu/policy/PolicyManager.kt`
- `app/src/main/java/com/tripleu/policy/AppPolicyController.kt`

## What it does
- Hides `com.android.vending` via Device Policy.
- Persists `system.play_store_blocked` in `ConfigStore`.

## How it runs
- Toggle in `PrivacyFragment` calls `SystemToggleHandler.onPlayStoreToggle`.
- That calls `PolicyManager.toggleAppBlock(...)`.
- Requires device owner (enforced by `DeviceOwnerActionExecutor`).
