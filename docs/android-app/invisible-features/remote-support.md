# Remote support (screen share + control)

Where it lives:
- `app/src/main/java/com/tripleu/remote/RemotePermissionActivity.kt`
- `app/src/main/java/com/tripleu/remote/RemoteService.kt`
- `app/src/main/java/com/tripleu/remote/RemoteStreamManager.kt`
- `app/src/main/java/com/tripleu/remote/RemoteInputHandler.kt`
- `app/src/main/java/com/tripleu/remote/RemoteInputReceiver.kt`

What it does:
- Shares the device screen to an admin.
- Accepts remote input (tap, swipe, text, nav keys) via accessibility.
- Tracks session status in Firestore.

How it runs:
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
