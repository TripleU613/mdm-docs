# Accessibility auto-enable

Where it lives:
- `app/src/main/java/com/tripleu/accessibility/AccessibilityMonitorService.kt`
- `app/src/main/java/com/tripleu/vpn/BootComplete.java`
- `app/src/main/java/com/tripleu/TripleUApp.kt`

What it does:
- Keeps the accessibility service enabled so blocking features keep working.
- Runs as a foreground service with a low-priority notification.

How it runs:
- Watches `Settings.Secure.ACCESSIBILITY_ENABLED` and `ENABLED_ACCESSIBILITY_SERVICES`.
- If the app service is missing, it writes it back into the enabled list.
- Started on boot and also during app startup.
