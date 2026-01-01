# Accessibility screenshot capturer (unused)

Where it lives:
- `app/src/main/java/com/tripleu/remote/AccessibilityScreenshotCapturer.kt`

What it does:
- Implements a WebRTC `VideoCapturer` that uses the Accessibility screenshot API (API 33+).
- Falls back to black frames when screenshots are unavailable.

How it runs:
- Not referenced elsewhere in the app right now.
- When used, it calls `AppBlockAccessibilityService.requestScreenshot(...)` on a timer.
