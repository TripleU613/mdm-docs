# App state sync

## App snapshot storage (apps collection)

### Where it lives
- `app/src/main/java/com/tripleu/config/AppSnapshotStorage.kt`
- `app/src/main/java/com/tripleu/appcontrol/AppInstallReceiver.kt`
- `app/src/main/java/com/tripleu/appcontrol/NewAppDetectorWorker.kt`
- `app/src/main/java/com/tripleu/ui/fragments/UpdateAppsFragment.kt`
- `app/src/main/java/com/tripleu/vpn/AdVpnServiceKt.kt`

### What it does
- Mirrors per-app policy state into Firestore `devices/{deviceId}/apps/{package}`.
- Ensures `updatedAtMs` and `deviceId` are present on every write.
- `markApproved` sets `approved=true` and clears `hidden` + `suspended`.

### How it runs
- `upsertPackage()` merges fields with `SetOptions.merge()`.
- Called when:
  - New apps are detected and blocked.
  - Apps are approved or unblocked.
  - VPN/app policy changes are mirrored.

## App remote watcher

### Where it lives
- `app/src/main/java/com/tripleu/config/AppRemoteWatcher.kt`
- `app/src/main/java/com/tripleu/config/FirestoreDevicePaths.kt`

### What it does
- Applies per-app policy changes pushed from the portal.
- Keeps device state in sync without opening the Apps screen.

### How it runs
- Listener attach is triggered by `PeriodicTaskRunner` (5s tick).
- Listens to `devices/{deviceId}/apps` snapshots once attached.
- For each app doc, applies:
  - hide, suspend, uninstall block.
  - network block, WebView block/exception, video block.
- Tracks portal-enforced hide/suspend sets in prefs:
  - `MDMSettings.policy_hidden_apps`
  - `MDMSettings.policy_suspended_apps`
- Auto-unblock paths skip apps listed in those policy sets.
- If the per-app network block changed, restarts the main VPN so rules apply.
  - Skips the restart when VPN2 is active (`Vpn2State.shouldBlockLegacy`).

## App inventory uploader

### Where it lives
- `app/src/main/java/com/tripleu/config/AppInventoryUploader.kt`
- `app/src/main/java/com/tripleu/config/FirestoreDevicePaths.kt`

### What it does
- Uploads installed app metadata to Firestore so the portal can manage apps without opening the Apps tab.
- Uploads icons only when the app version changes.

### How it runs
- Triggered by `PeriodicTaskRunner` (5s tick; throttled to ~5 minutes).
- Writes to `devices/{deviceId}/apps/{package}` with:
  - `label`, `system` (non-launchable), `versionName`, `versionCode`, `installed`, `source`.
- Encodes icons as 96px PNG Base64 when version is newer than last upload.
- Calls `markDeviceAlive()` during uploads.
