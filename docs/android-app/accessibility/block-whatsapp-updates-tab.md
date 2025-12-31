# Block WhatsApp updates tab

Where it lives:
- `app/src/main/java/com/tripleu/ui/fragments/PrivacyFragment.kt`
- `app/src/main/java/com/tripleu/accessibility/AppBlockAccessibilityService.kt`

What it does:
- Blocks the WhatsApp Updates tab by exiting if the tab is selected.

How it runs:
- Toggle sets `whatsapp_updates_blocked` (prefs) and `accessibility.whatsapp_updates_blocked` (`ConfigStore`).
- `AppBlockAccessibilityService.handleWhatsApp` scans for "Updates"/Hebrew updates text and checks if the parent tab is selected.
- Only runs for `com.whatsapp` and `com.whatsapp.w4b`.
- When detected, it performs `GLOBAL_ACTION_HOME`.
- Enabling the toggle shows the accessibility-required dialog if the service is off.
