# Remote control + reporting

## Remote command receiver

### Where it lives
- `app/src/main/java/com/tripleu/commands/CommandReceiver.kt`
- `app/src/main/java/com/tripleu/config/FirestoreDevicePaths.kt`

### What it does
- Listens for admin commands in Firestore and executes them.
- Updates command status and writes a small audit record.

### How it runs
- Watches: `devices/{deviceId}/commands`.
- Supported command types:
  - `lock`: `PolicyManager.lockDevice()`.
  - `wipe`: `PolicyManager.wipeDevice()`.
  - `sync`: `ConfigPoller.start()`.
  - `uninstall`: reverts policies + clears device owner.
  - `inventory`: `AppInventoryUploader.uploadNow()`.
  - `start_remote`: clears previous session data, sets `remote_session.status=starting`, launches `RemotePermissionActivity`.
  - `stop_remote`: stops `RemoteService` and marks session ended.
- Status flow: `pending` -> `done` or `error`.
- If the command collection is missing, it tries to adopt `users/{uid}.activeDeviceId`.

## Remote support (screen share + control)

### Where it lives
- `app/src/main/java/com/tripleu/remote/RemotePermissionActivity.kt`
- `app/src/main/java/com/tripleu/remote/RemoteService.kt`
- `app/src/main/java/com/tripleu/remote/RemoteStreamManager.kt`
- `app/src/main/java/com/tripleu/remote/RemoteInputHandler.kt`
- `app/src/main/java/com/tripleu/remote/RemoteInputReceiver.kt`

### What it does
- Shares the device screen to an admin.
- Accepts remote input (tap, swipe, text, nav keys) via accessibility.
- Tracks session status in Firestore.

### How it runs
- `RemotePermissionActivity` requests MediaProjection and starts `RemoteService`.
- `RemoteService` runs foreground and creates `RemoteStreamManager`.
- `RemoteStreamManager`:
  - Uses WebRTC for video.
  - Uses Firestore for signaling: `devices/{deviceId}/remote_session/current`.
  - ICE candidates in subcollections `ice_candidates` and `remote_candidates`.
  - DataChannel `control` receives JSON input events.
- `RemoteInputHandler` injects gestures and text through `AppBlockAccessibilityService`:
  - `input` (tap/drag), `nav` (home/back/recents), `text`, `key` (backspace/enter).
  - If accessibility is not running, it broadcasts to `RemoteInputReceiver`.
- Session status is updated to `starting`, `offering`, `connected`, or `ended`.

## Report portal share

### Where it lives
- `app/src/main/java/com/tripleu/ui/activities/ReportShareActivity.kt`
- `app/src/main/java/com/tripleu/ui/activities/ReportPortalActivity.kt`
- `app/src/main/AndroidManifest.xml`

### What it does
- Adds a Share target for URLs to open a local report portal.

### How it runs
- `ReportShareActivity` is exported for `ACTION_SEND` with `text/plain`.
- It extracts a URL from shared text and builds:
  - `http://10.9.0.1/.kvylock/appeal?mode=report&url=...&host=...`
- Launches `ReportPortalActivity` with that URL.
- `ReportPortalActivity` loads the portal URL in a WebView.
