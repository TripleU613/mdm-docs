# Block WhatsApp channels

Where it lives:
- `app/src/main/java/com/tripleu/ui/fragments/PrivacyFragment.kt`
- `app/src/main/java/com/tripleu/accessibility/AppBlockAccessibilityService.kt`
- `app/src/main/java/com/tripleu/whatsapp/WhatsAppChannelDetector.kt`
- `app/src/main/java/com/tripleu/whatsapp/WhatsAppPenaltyManager.kt`

What it does:
- Detects WhatsApp Channels screens and exits (back/back, then Home).
- Uses a penalty timer to force back/home for a duration after repeated violations.

How it runs:
- Toggle sets `whatsapp_channels_blocked` (prefs) and `accessibility.whatsapp_channels_blocked` (`ConfigStore`).
- `AppBlockAccessibilityService` calls `WhatsAppChannelDetector.detectWhatsAppChannel(...)` when channel/status blocking is enabled.
- Only runs for `com.whatsapp` and `com.whatsapp.w4b`.
- The detector looks for follower counts, channel visibility text, and channel view-id hints.
- On match, it runs `WhatsAppPenaltyManager.recordViolation(CHANNEL)` which enforces a timed lockout (30s, 90s, then 180s) with a notification.
