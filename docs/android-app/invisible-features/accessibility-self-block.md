# Accessibility settings self-block

Where it lives:
- `app/src/main/java/com/tripleu/accessibility/AccessibilitySelfBlocker.kt`
- `app/src/main/java/com/tripleu/accessibility/AppBlockAccessibilityService.kt`

What it does:
- Prevents users from disabling the TripleU MDM accessibility service.
- If the accessibility settings screen is detected, it backs out.

How it runs:
- Controlled by `accessibility_self_block_enabled` (prefs; enabled by default).
- In `com.android.settings`, the service looks for:
  - "TripleU MDM" text.
  - Toggle labels like "Use TripleU MDM App Blocker" (English/Hebrew).
- If both are found, it sends `GLOBAL_ACTION_BACK`.
