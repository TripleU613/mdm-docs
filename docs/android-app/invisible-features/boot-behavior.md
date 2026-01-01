# Boot behavior

Where it lives:
- `app/src/main/java/com/tripleu/vpn/BootComplete.java`

What it does:
- Restarts key services after device boot.

How it runs:
- Calls `AdVpnService.checkStartVpnOnBoot(...)`.
- Starts `AccessibilityMonitorService` as a foreground service.
- If `block_new_apps` is enabled:
  - Seeds known apps.
  - Starts `AppMonitorService`.
- Otherwise cancels `NewAppDetector` and stops `AppMonitorService`.
