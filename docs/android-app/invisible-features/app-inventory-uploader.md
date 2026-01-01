# App inventory uploader

Where it lives:
- `app/src/main/java/com/tripleu/config/AppInventoryUploader.kt`
- `app/src/main/java/com/tripleu/config/FirestoreDevicePaths.kt`

What it does:
- Uploads installed app metadata to Firestore so the portal can manage apps without opening the Apps tab.
- Uploads icons only when the app version changes.

How it runs:
- Runs in a background loop every ~5 minutes.
- Writes to `devices/{deviceId}/apps/{package}` with:
  - `label`, `system` (non-launchable), `versionName`, `versionCode`, `installed`, `source`.
- Encodes icons as 96px PNG Base64 when version is newer than last upload.
- Calls `markDeviceAlive()` during uploads.
