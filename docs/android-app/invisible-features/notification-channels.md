# Notification channels

Where it lives:
- `app/src/main/java/com/tripleu/vpn/NotificationChannels.java`
- `app/src/main/java/com/tripleu/vpn/AdVpnService.java`
- `app/src/main/java/com/tripleu/updates/UpdateCheckWorker.kt`
- `app/src/main/java/com/tripleu/appcontrol/AppMonitorService.kt`
- `app/src/main/java/com/tripleu/TripleUApp.kt`

What it does:
- Creates notification channel groups for service status and update status.
- Used by VPN, app monitor, and update checks.

How it runs:
- `NotificationChannels.onCreate()` is called at app start and by services.
- Groups:
  - `notifications.service` (running/paused).
  - `notifications.update` (update status).
- Channel IDs are used by foreground services and host file update notifications.
