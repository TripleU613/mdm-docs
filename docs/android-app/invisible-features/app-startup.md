# App startup bootstrap

Where it lives:
- `app/src/main/java/com/tripleu/TripleUApp.kt`

What it does:
- Boots background services and watchers after first resume (or 10s fallback).
- Runs only in the main app process.
- Reapplies app density and initializes integrity checks.

How it runs:
- `triggerDeferredStartup()` waits ~350ms after first resume.
- `startDeferredWork()` starts:
  - `AccessibilityMonitorService` (foreground).
  - `AutoUpdateManager` schedule + immediate check.
  - `HomeUpdateBridge`, `ConfigPoller`, `CloudSyncManager`.
  - `CommandReceiver`, `AppRemoteWatcher`, `Vpn2RemoteWatcher`.
  - `AppInventoryUploader` and `NewAppDetector`.
- Registers `SessionLifecycleCallbacks` to lock the app on background.
