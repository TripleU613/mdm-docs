# Lockout mode

Where it lives:
- `app/src/main/java/com/tripleu/config/ConfigPoller.kt`
- `app/src/main/java/com/tripleu/ui/activities/LockoutActivity.kt`

What it does:
- Forces the device into a locked kiosk screen from a remote config flag.
- Prevents back navigation and keeps LockTask active.

How it runs:
- `ConfigPoller` checks `system.lockout_enabled`.
- When true:
  - Calls `setLockTaskPackages(...)` for this app.
  - Launches `LockoutActivity` with `NEW_TASK | REORDER_TO_FRONT`.
- `LockoutActivity` calls `startLockTask()` and polls config every 3s.
- When the flag turns off, it exits LockTask and finishes.
