# Remote command receiver

Where it lives:
- `app/src/main/java/com/tripleu/commands/CommandReceiver.kt`
- `app/src/main/java/com/tripleu/config/FirestoreDevicePaths.kt`

What it does:
- Listens for admin commands in Firestore and executes them.
- Updates command status and writes a small audit record.

How it runs:
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
