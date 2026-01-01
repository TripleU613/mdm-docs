# Permissions check

## Where it lives
- `app/src/main/java/com/tripleu/ui/activities/PermissionsCheckActivity.kt`
- `app/src/main/java/com/tripleu/policy/DefaultPolicyHandler.kt`
- `app/src/main/java/com/tripleu/device/DeviceInfoUploader.kt`

## What it does
- Ensures the app is Device Owner + Device Admin.
- Grants required runtime permissions and accessibility automation.
- Applies default policies and marks setup complete.

## How it runs
- Required checks:
  - Device Owner: `DevicePolicyManager.isDeviceOwnerApp`.
  - Device Admin: `DevicePolicyManager.isAdminActive`.
  - Write secure settings: `WRITE_SECURE_SETTINGS`.
  - Accessibility service enabled.
- If not Device Owner, shows ADB command:
  - `adb shell dpm set-device-owner "com.tripleu.mdm/.a"`
- If `WRITE_SECURE_SETTINGS` missing, shows ADB command:
  - `adb shell pm grant com.tripleu.mdm android.permission.WRITE_SECURE_SETTINGS`
- Optional "Self grant" tries the same commands via `su -c`.
- If `WRITE_SECURE_SETTINGS` is present, the app enables accessibility via secure settings.
- Grants managed runtime permissions:
  - `READ_PHONE_STATE`
  - `POST_NOTIFICATIONS` (Android 13+)
- Marks VPN consent as granted in prefs (`vpn_permission_granted=true`).
- Privacy/Network tab re-checks extra permissions and can redirect back here if missing:
  - Manage external storage (Android 11+ or legacy `WRITE_EXTERNAL_STORAGE`).
  - Install unknown apps (`canRequestPackageInstalls()`).
  - VPN consent or cached `vpn_permission_granted`.
- Finalize setup:
  - `DeviceInfoUploader.updateImeiIfPossible()`
  - `PolicyManager.setFrpAccounts("tripleuworld@gmail.com")`
  - `PolicyManager.setOrganizationBranding(...)`
  - `DefaultPolicyHandler.apply()` (blocks network reset, enables accessibility self-block, resets VPN flags)
  - Sets `setup_complete=true`
  - Schedules `AutoUpdateManager` periodic + immediate checks.
  - Starts `MainActivity`.
