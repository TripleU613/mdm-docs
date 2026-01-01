# Device admin receiver selection

Where it lives:
- `app/src/main/java/com/tripleu/policy/DeviceAdminProvider.kt`
- `app/src/main/java/com/tripleu/mdm/a.kt`
- `app/src/main/java/com/tripleu/device/AdminReceiver.kt`

What it does:
- Chooses which `DeviceAdminReceiver` component is active.
- Supports a newer receiver (`com.tripleu.mdm.a`) and legacy `AdminReceiver`.

How it runs:
- `DeviceAdminProvider.admin()` checks `DevicePolicyManager.isAdminActive()`:
  - Uses `com.tripleu.mdm.a` if active.
  - Falls back to `com.tripleu.device.AdminReceiver` if active.
  - Defaults to `com.tripleu.mdm.a`.
