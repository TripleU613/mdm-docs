# Android Auto quirk

Where it lives:
- `app/src/main/java/com/tripleu/ui/fragments/PrivacyFragment.kt`
- `app/src/main/java/com/tripleu/accessibility/AppBlockAccessibilityService.kt`

What it does:
- If enabled, sends the user back to Home when accessibility events come from Google Search or Maps.

How it runs:
- Toggle sets `android_auto_quirk_enabled` (prefs) and `accessibility.android_auto_quirk` (`ConfigStore`).
- `AppBlockAccessibilityService.onAccessibilityEvent` checks the flag and package name (`com.google.android.googlequicksearchbox`, `com.google.android.apps.maps`), then calls `performGlobalAction(GLOBAL_ACTION_HOME)`.
- Enabling the toggle shows the accessibility-required dialog if the service is off.
