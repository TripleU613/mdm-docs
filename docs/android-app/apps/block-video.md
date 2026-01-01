# Block video

## Where it lives
- `app/src/main/java/com/tripleu/ui/fragments/UpdateAppsFragment.kt`
- `app/src/main/java/com/tripleu/network/FirewallManager.kt`
- `app/src/main/java/com/tripleu/accessibility/AppBlockAccessibilityService.kt`
- `app/src/main/java/com/tripleu/video/VideoDetector.kt`

## What it does
- Marks an app for video blocking.
- Blocks detected video playback by backing out and returning Home.

## How it runs
- "Block video" sets the package in `firewall_rules` -> `video_blocklist`.
- `AppBlockAccessibilityService` checks this list and uses `VideoDetector` to detect video UIs.
- Detection signals include:
  - Video player class names (`VideoView`, ExoPlayer, YouTube, Media3).
  - Video keywords and control labels (play, pause, seek, fullscreen, etc).
  - Known video app packages and gallery/video file cues.
- When detected, it shows a "Video blocked" toast, sends back/back/back, then Home.
