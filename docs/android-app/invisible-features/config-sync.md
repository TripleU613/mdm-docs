# Config + sync

## Config store (local SQLite)

### Where it lives
- `app/src/main/java/com/tripleu/config/ConfigStore.kt`
- `app/src/main/java/com/tripleu/config/ConfigDbHelper.kt`

### What it does
- Stores app config entries in `config.db` (table `config_entries`).
- Each entry has `config_key`, `config_value`, `config_type`, `updated_at`.
- Writes are async on a single-thread executor.

### How it runs
- `initialize()` sets up `ConfigDbHelper`.
- `putString/Boolean/Int/Long/Json` writes with `CONFLICT_REPLACE`.
- `getAll()` returns `ConfigEntry` rows for sync and snapshot.
- `delete()` removes a key; `shutdown()` stops the executor.

## Cloud config sync

### Where it lives
- `app/src/main/java/com/tripleu/config/CloudSyncManager.kt`
- `app/src/main/java/com/tripleu/config/FirestoreDevicePaths.kt`
- `app/src/main/java/com/tripleu/config/ConfigStore.kt`

### What it does
- Keeps `config.db` in sync with Firestore.
- Resolves conflicts per key using `updatedAtMs`.
- Pushes device heartbeat and FCM token.
- Seeds the config doc if it is missing.

### How it runs
- Firestore doc: `devices/{deviceId}/config/state/current/current`.
- Snapshot listener applies newer remote entries to `ConfigStore`.
- Uses `cloudUpdated`/`deviceUpdated` flags to coordinate which side is newer.
- Every 30s, `syncOnce()` pushes newer local entries.
- Every 60s, `writeHeartbeat()` updates `lastSeenMs` + `deviceInfo`.
- On first attach, it creates the config doc and triggers `AppInventoryUploader.uploadNow()`.
- `uploadFcmToken()` attaches `deviceInfo.fcmToken` when available.
- If `auth.pin_sha256` is received, it also stores `mdm_pin_hash` in `MDMSettings`.

## Config poller

### Where it lives
- `app/src/main/java/com/tripleu/config/ConfigPoller.kt`

### What it does
- Applies config changes from `ConfigStore` to device state.
- Runs continuously when the app is in process and device owner is set.

### How it runs
- `start()` loops every ~30s and calls `applyIfChanged()`.
- Applies:
  - System restrictions (users, factory reset, APK install, etc).
  - App rules (hide/suspend/uninstall/network/webview/video).
  - Accessibility flags (WhatsApp blocks, AI, webview block-all, browser dummy mode).
  - Network settings (VPN, whitelist, block all traffic, private DNS).
  - Settings screen values (language, app density).
  - Muted updates and app approvals.
- If `system.lockout_enabled` is true, launches `LockoutActivity` and sets LockTask.

## Initial config snapshot

### Where it lives
- `app/src/main/java/com/tripleu/config/ConfigSnapshotWriter.kt`
- `app/src/main/java/com/tripleu/MainActivity.kt`

### What it does
- Captures a one-time snapshot of device/app/account state.
- Stores the snapshot locally in `ConfigStore` (not uploaded).

### How it runs
- `MainActivity` calls `ConfigSnapshotWriter.ensureInitialSnapshot()` after setup.
- Runs only once and only if the app is device owner.
- Writes:
  - `snapshot.initial_payload` (JSON).
  - `snapshot.initial_written_at` (timestamp).
- Snapshot includes app version, device info, Firebase email/uid, language, density, muted packages, and all `ConfigStore` entries.
