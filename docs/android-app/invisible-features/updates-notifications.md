# Updates + notifications

## Auto update checks

### Where it lives
- `app/src/main/java/com/tripleu/updates/AutoUpdateManager.kt`
- `app/src/main/java/com/tripleu/updates/UpdateCheckWorker.kt`
- `app/src/main/java/com/tripleu/updates/UpdateMuteReceiver.kt`

### What it does
- Periodically checks for a newer APK and attempts silent install.
- Shows a notification if install is blocked and updates are not muted.

### How it runs
- `AutoUpdateManager` schedules `UpdateCheckWorker` every 30 minutes after setup.
- Worker reads `latestversion.txt` from GitHub and parses:
  - `versioncode: <int>`
  - `apk link: <url>`
- If newer and device owner, it tries silent install via `PackageInstaller`.
- If not installed, it posts a notification with a "Don't show again" action.
- `UpdateMuteReceiver` stores `update_alerts_muted=true` in `MDMSettings`.

## Aurora device spoofing

### Where it lives
- `app/src/main/java/com/tripleu/updates/PlayDeviceSpoofManager.kt`
- `app/src/main/java/com/tripleu/updates/NativeDeviceInfoProvider.kt`
- `app/src/main/java/com/tripleu/updates/PlayAuthStore.kt`
- `app/src/main/java/com/tripleu/updates/AuroraUpdateRepository.kt`

### What it does
- Builds a device profile used to authenticate with the Aurora GPlay API.
- Caches auth tokens and refreshes them periodically.

### How it runs
- `AuroraUpdateRepository` calls `PlayDeviceSpoofManager.initialize()` on init.
- `PlayDeviceSpoofManager` caches a Properties snapshot from `NativeDeviceInfoProvider`.
- Profile selection:
  - Uses a Pixel profile if the device is Huawei or not already Google-branded.
  - If the profile is still "native", it overwrites to Pixel 7 values and sets `Spoof.Profile=pixel7`.
- Auth data is cached in `play_update_auth` via `PlayAuthStore`.
- `AuroraUpdateRepository` refreshes auth if:
  - No cached token.
  - The token is older than 1 hour.
  - A validation call fails.
- On auth failure, it refreshes the spoof profile (`reason=auth_failure_<code>`).

## Notification channels

### Where it lives
- `app/src/main/java/com/tripleu/vpn/NotificationChannels.java`
- `app/src/main/java/com/tripleu/vpn/AdVpnService.java`
- `app/src/main/java/com/tripleu/updates/UpdateCheckWorker.kt`
- `app/src/main/java/com/tripleu/appcontrol/AppMonitorService.kt`
- `app/src/main/java/com/tripleu/TripleUApp.kt`

### What it does
- Creates notification channel groups for service status and update status.
- Used by VPN, app monitor, and update checks.

### How it runs
- `NotificationChannels.onCreate()` is called at app start and by services.
- Groups:
  - `notifications.service` (running/paused).
  - `notifications.update` (update status).
- Channel IDs are used by foreground services and host file update notifications.
