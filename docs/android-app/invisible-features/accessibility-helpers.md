# Accessibility helpers

## Accessibility auto-enable

### Where it lives
- `app/src/main/java/com/tripleu/accessibility/AccessibilityMonitorService.kt`
- `app/src/main/java/com/tripleu/vpn/BootComplete.java`
- `app/src/main/java/com/tripleu/TripleUApp.kt`

### What it does
- Keeps the accessibility service enabled so blocking features keep working.
- Runs as a foreground service with a low-priority notification.

### How it runs
- Watches `Settings.Secure.ACCESSIBILITY_ENABLED` and `ENABLED_ACCESSIBILITY_SERVICES`.
- If the app service is missing, it writes it back into the enabled list.
- Started on boot and also during app startup.

## Accessibility settings self-block

### Where it lives
- `app/src/main/java/com/tripleu/accessibility/AccessibilitySelfBlocker.kt`
- `app/src/main/java/com/tripleu/accessibility/AppBlockAccessibilityService.kt`

### What it does
- Prevents users from disabling the TripleU MDM accessibility service.
- If the accessibility settings screen is detected, it backs out.

### How it runs
- Controlled by `accessibility_self_block_enabled` (prefs; enabled by default).
- In `com.android.settings`, the service looks for:
  - "TripleU MDM" text.
  - Toggle labels like "Use TripleU MDM App Blocker" (English/Hebrew).
- If both are found, it sends `GLOBAL_ACTION_BACK`.

## Screen capture dialog auto-accept

### Where it lives
- `app/src/main/java/com/tripleu/accessibility/ScreenCaptureDialogAutoAcceptor.kt`
- `app/src/main/java/com/tripleu/accessibility/AppBlockAccessibilityService.kt`

### What it does
- Auto-clicks the MediaProjection consent dialog (Start/Allow/OK).
- Makes remote support start faster without manual taps.

### How it runs
- Controlled by `AppBlockAccessibilityService.autoAcceptScreenCapture` (default true).
- On accessibility events, it checks dialog keywords in English/Hebrew.
- Clicks accept buttons or their clickable parent.
- Fallback: clicks any non-cancel button that looks like accept.

## Gboard GIF search blocker

### Where it lives
- `app/src/main/java/com/tripleu/accessibility/GboardBlocker.kt`
- `app/src/main/java/com/tripleu/accessibility/AppBlockAccessibilityService.kt`

### What it does
- Closes the Gboard GIF/search media pane when enabled.

### How it runs
- Enabled by `gboard_gif_blocked=true` (prefs).
- Finds the Gboard window and detects a search bar + search icon.
- If detected, it triggers back three times to exit the pane.

## Accessibility screenshot capturer (unused)

### Where it lives
- `app/src/main/java/com/tripleu/remote/AccessibilityScreenshotCapturer.kt`

### What it does
- Implements a WebRTC `VideoCapturer` that uses the Accessibility screenshot API (API 33+).
- Falls back to black frames when screenshots are unavailable.

### How it runs
- Not referenced elsewhere in the app right now.
- When used, it calls `AppBlockAccessibilityService.requestScreenshot(...)` on a timer.
