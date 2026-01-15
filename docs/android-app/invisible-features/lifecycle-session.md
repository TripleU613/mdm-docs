# Lifecycle + session

## App startup bootstrap

### Where it lives
- `app/src/main/java/com/tripleu/TripleUApp.kt`

### What it does
- Boots background services and watchers after first resume (or 10s fallback).
- Runs only in the main app process.
- Reapplies app density.

### How it runs
- `triggerDeferredStartup()` waits ~350ms after first resume.
- `startDeferredWork()` starts:
  - `AccessibilityMonitorService` (foreground).
  - `AutoUpdateManager` schedule + immediate check.
  - `HomeUpdateBridge`, `ConfigPoller`, `CloudSyncManager`.
  - `CommandReceiver`, `AppRemoteWatcher`, `Vpn2RemoteWatcher`.
  - `AppInventoryUploader` and `NewAppDetector`.
  - `PeriodicTaskRunner` for shared 5s/30s/60s ticks.
- Registers `SessionLifecycleCallbacks` to lock the app on background.

## Boot behavior

### Where it lives
- `app/src/main/java/com/tripleu/vpn/BootComplete.java`

### What it does
- Restarts key services after device boot.

### How it runs
- Calls `BootComplete.checkStartPcapOnBoot(...)`.
- Starts `Vpn2RemoteWatcher` and `PeriodicTaskRunner`.
- Starts `AccessibilityMonitorService` as a foreground service.
- If `block_new_apps` is enabled:
  - Seeds known apps.
  - Starts `AppMonitorService`.
- Otherwise cancels `NewAppDetector` and stops `AppMonitorService`.

## Session lock

### Where it lives
- `app/src/main/java/com/tripleu/session/Session.kt`
- `app/src/main/java/com/tripleu/TripleUApp.kt`

### What it does
- Locks the app when it leaves the foreground.
- Allows short background grace periods for system pickers.

### How it runs
- `Session.activityResumed()` and `activityPaused()` track foreground state.
- `AUTH_TIMEOUT_MS` is 0, so auth resets immediately when the app backgrounds.
- `allowBackgroundFor()` delays lock for ~10s (file pickers, VPN consent).
- `TripleUApp.SessionLifecycleCallbacks` skips auth tracking for login/setup screens.

## Lockout mode

### Where it lives
- `app/src/main/java/com/tripleu/config/ConfigPoller.kt`
- `app/src/main/java/com/tripleu/ui/activities/LockoutActivity.kt`

### What it does
- Forces the device into a locked kiosk screen from a remote config flag.
- Prevents back navigation and keeps LockTask active.

### How it runs
- `ConfigPoller` checks `system.lockout_enabled`.
- When true:
  - Calls `setLockTaskPackages(...)` for this app.
  - Launches `LockoutActivity` with `NEW_TASK | REORDER_TO_FRONT`.
- `LockoutActivity` calls `startLockTask()` and polls config every 3s.
- When the flag turns off, it exits LockTask and finishes.
