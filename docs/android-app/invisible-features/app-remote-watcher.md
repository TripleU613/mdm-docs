# App remote watcher

Where it lives:
- `app/src/main/java/com/tripleu/config/AppRemoteWatcher.kt`
- `app/src/main/java/com/tripleu/config/FirestoreDevicePaths.kt`

What it does:
- Applies per-app policy changes pushed from the portal.
- Keeps device state in sync without opening the Apps screen.

How it runs:
- Listens to `devices/{deviceId}/apps` snapshots.
- For each app doc, applies:
  - hide, suspend, uninstall block.
  - network block, WebView block/exception, video block.
- If the per-app network block changed, restarts the main VPN so rules apply.
