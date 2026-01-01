# Block status

## Where it lives
- `app/src/main/java/com/tripleu/ui/fragments/PrivacyFragment.kt`
- `app/src/main/java/com/tripleu/accessibility/AppBlockAccessibilityService.kt`
- `app/src/main/java/com/tripleu/whatsapp/WhatsAppStatusDetector.kt`
- `app/src/main/java/com/tripleu/whatsapp/WhatsAppPenaltyManager.kt`

## What it does
- Detects the WhatsApp Status UI and exits (back, then Home).
- Uses the same penalty timer system as Channels (timed lockouts).

## How it runs
- Toggle sets `whatsapp_status_blocked` (prefs) and `accessibility.whatsapp_status_blocked` (`ConfigStore`).
- `AppBlockAccessibilityService` calls `WhatsAppStatusDetector.detectWhatsAppStatus(...)`.
- Only runs for `com.whatsapp` and `com.whatsapp.w4b`.
- The detector looks for status containers, reply UI, and heart/menu patterns.
- On match, it records a STATUS violation and forces a back + home.
