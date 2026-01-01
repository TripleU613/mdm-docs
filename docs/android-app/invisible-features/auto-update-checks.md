# Auto update checks

Where it lives:
- `app/src/main/java/com/tripleu/updates/AutoUpdateManager.kt`
- `app/src/main/java/com/tripleu/updates/UpdateCheckWorker.kt`
- `app/src/main/java/com/tripleu/updates/UpdateMuteReceiver.kt`

What it does:
- Periodically checks for a newer APK and attempts silent install.
- Shows a notification if install is blocked and updates are not muted.

How it runs:
- `AutoUpdateManager` schedules `UpdateCheckWorker` every 30 minutes after setup.
- Worker reads `latestversion.txt` from GitHub and parses:
  - `versioncode: <int>`
  - `apk link: <url>`
- If newer and device owner, it tries silent install via `PackageInstaller`.
- If not installed, it posts a notification with a "Don't show again" action.
- `UpdateMuteReceiver` stores `update_alerts_muted=true` in `MDMSettings`.
