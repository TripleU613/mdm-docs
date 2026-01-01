# Identity + admin

## Device identity + Firestore paths

### Where it lives
- `app/src/main/java/com/tripleu/config/FirestoreDevicePaths.kt`

### What it does
- Generates and stores the device binding ID.
- Centralizes Firestore paths for device data.

### How it runs
- Device ID is stored in `MDMSettings` as `device_binding_id`.
- ID format: `device-<uuid>` (not ANDROID_ID).
- Paths used:
  - Device doc: `devices/{deviceId}`.
  - Config doc: `devices/{deviceId}/config/state/current/current`.
  - Apps collection: `devices/{deviceId}/apps`.
  - Commands collection: `devices/{deviceId}/commands`.
- `markDeviceAlive()` updates status + `lastSeenMs` and optional `deviceInfo`.

## Device admin receiver selection

### Where it lives
- `app/src/main/java/com/tripleu/policy/DeviceAdminProvider.kt`
- `app/src/main/java/com/tripleu/mdm/a.kt`
- `app/src/main/java/com/tripleu/device/AdminReceiver.kt`

### What it does
- Chooses which `DeviceAdminReceiver` component is active.
- Supports a newer receiver (`com.tripleu.mdm.a`) and legacy `AdminReceiver`.

### How it runs
- `DeviceAdminProvider.admin()` checks `DevicePolicyManager.isAdminActive()`:
  - Uses `com.tripleu.mdm.a` if active.
  - Falls back to `com.tripleu.device.AdminReceiver` if active.
  - Defaults to `com.tripleu.mdm.a`.

## Device info uploader (IMEI)

### Where it lives
- `app/src/main/java/com/tripleu/device/DeviceInfoUploader.kt`

### What it does
- Uploads the device IMEI to Firestore for the signed-in user.

### How it runs
- Only runs when:
  - Firebase user is signed in.
  - App is device owner.
  - `READ_PHONE_STATE` permission is granted.
- Reads IMEI via `TelephonyManager.imei`.
- Writes to `users/{uid}.imei` and caches `imei_last` + `imei_uploaded` in `MDMSettings`.

## Default policies (first-time setup)

### Where it lives
- `app/src/main/java/com/tripleu/policy/DefaultPolicyHandler.kt`
- `app/src/main/java/com/tripleu/ui/activities/PermissionsCheckActivity.kt`
- `app/src/main/java/com/tripleu/ui/fragments/PrivacyFragment.kt`

### What it does
- Applies one-time defaults after setup completes.
- Blocks network reset.
- Sets FRP accounts and organization branding.
- Enables accessibility self-block.
- Resets VPN and whitelist flags to off.

### How it runs
- Runs once when device owner is active (API 28+).
- Sets `UserManager.DISALLOW_NETWORK_RESET`.
- Calls `PolicyManager.setFrpAccounts(setOf("tripleuworld@gmail.com"))`.
- Calls `PolicyManager.setOrganizationBranding(...)` (org name + lock screen message).
- Writes prefs:
  - `network_reset_blocked=true`
  - `accessibility_self_block_enabled=true`
  - `default_policies_applied=true`
  - `is_vpn_on=false`
  - `whitelist_on=false`
