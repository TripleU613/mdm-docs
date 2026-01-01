# Cloud config sync

Where it lives:
- `app/src/main/java/com/tripleu/config/CloudSyncManager.kt`
- `app/src/main/java/com/tripleu/config/FirestoreDevicePaths.kt`
- `app/src/main/java/com/tripleu/config/ConfigStore.kt`

What it does:
- Keeps `config.db` in sync with Firestore.
- Resolves conflicts per key using `updatedAtMs`.
- Pushes device heartbeat and FCM token.
- Seeds the config doc if it is missing.

How it runs:
- Firestore doc: `devices/{deviceId}/config/state/current/current`.
- Snapshot listener applies newer remote entries to `ConfigStore`.
- Uses `cloudUpdated`/`deviceUpdated` flags to coordinate which side is newer.
- Every 30s, `syncOnce()` pushes newer local entries.
- Every 60s, `writeHeartbeat()` updates `lastSeenMs` + `deviceInfo`.
- On first attach, it creates the config doc and triggers `AppInventoryUploader.uploadNow()`.
- `uploadFcmToken()` attaches `deviceInfo.fcmToken` when available.
- If `auth.pin_sha256` is received, it also stores `mdm_pin_hash` in `MDMSettings`.
