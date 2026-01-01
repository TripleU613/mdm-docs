# Block video

Where it lives:
- `app/src/main/java/com/tripleu/ui/fragments/UpdateAppsFragment.kt`
- `app/src/main/java/com/tripleu/network/FirewallManager.kt`
- `app/src/main/java/com/tripleu/accessibility/AppBlockAccessibilityService.kt`
- `app/src/main/java/com/tripleu/video/VideoDetector.kt`

What it does:
- Marks an app for video blocking.

How it runs:
- "Block video" sets the package in `firewall_rules` -> `video_blocklist`.
- `AppBlockAccessibilityService` checks this list and uses `VideoDetector` to detect video UIs.
- When detected, the service backs out and returns to Home.
