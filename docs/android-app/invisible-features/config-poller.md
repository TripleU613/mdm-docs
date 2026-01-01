# Config poller

Where it lives:
- `app/src/main/java/com/tripleu/config/ConfigPoller.kt`

What it does:
- Applies config changes from `ConfigStore` to device state.
- Runs continuously when the app is in process and device owner is set.

How it runs:
- `start()` loops every ~30s and calls `applyIfChanged()`.
- Applies:
  - System restrictions (users, factory reset, APK install, etc).
  - App rules (hide/suspend/uninstall/network/webview/video).
  - Accessibility flags (WhatsApp blocks, AI, webview block-all, browser dummy mode).
  - Network settings (VPN, whitelist, block all traffic, private DNS).
  - Settings screen values (language, app density).
  - Muted updates and app approvals.
- If `system.lockout_enabled` is true, launches `LockoutActivity` and sets LockTask.
