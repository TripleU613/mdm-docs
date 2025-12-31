# Disable APK install

Where it lives:
- `app/src/main/java/com/tripleu/ui/fragments/PrivacyFragment.kt`
- `app/src/main/java/com/tripleu/ui/privacy/SystemToggleHandler.kt`
- `app/src/main/java/com/tripleu/policy/PolicyManager.kt`
- `app/src/main/java/com/tripleu/policy/UserRestrictionController.kt`

What it does:
- Applies `UserManager.DISALLOW_INSTALL_APPS`.
- Persists `system.apk_install_blocked` in `ConfigStore`.

How it runs:
- Toggle in `PrivacyFragment` calls `SystemToggleHandler.onApkInstallToggle`.
- That calls `PolicyManager.toggleUserRestriction(...)`.
- Requires device owner (enforced by `DeviceOwnerActionExecutor`).
