# Device identity + Firestore paths

Where it lives:
- `app/src/main/java/com/tripleu/config/FirestoreDevicePaths.kt`

What it does:
- Generates and stores the device binding ID.
- Centralizes Firestore paths for device data.

How it runs:
- Device ID is stored in `MDMSettings` as `device_binding_id`.
- ID format: `device-<uuid>` (not ANDROID_ID).
- Paths used:
  - Device doc: `devices/{deviceId}`.
  - Config doc: `devices/{deviceId}/config/state/current/current`.
  - Apps collection: `devices/{deviceId}/apps`.
  - Commands collection: `devices/{deviceId}/commands`.
- `markDeviceAlive()` updates status + `lastSeenMs` and optional `deviceInfo`.
