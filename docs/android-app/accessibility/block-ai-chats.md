# Block AI chats

Where it lives:
- `app/src/main/java/com/tripleu/ui/fragments/PrivacyFragment.kt`
- `app/src/main/java/com/tripleu/accessibility/AppBlockAccessibilityService.kt`
- `app/src/main/java/com/tripleu/accessibility/AiContentBlocker.kt`

What it does:
- Blocks AI surfaces by backing out and returning Home.
- Targets Meta AI chat + Discover AIs (WhatsApp), Gemini chats (`com.google.android.apps.messaging`), and Google Photos Create tab (`com.google.android.apps.photos`).

How it runs:
- Toggle sets `ai_chat_blocked` (prefs) and `accessibility.in_app_ai_blocked` (`ConfigStore`).
- `AppBlockAccessibilityService` enables the flag and calls `AiContentBlocker.detectAndBlock(...)`.
- The blocker uses text/view-id patterns and cooldowns, then performs back + home with a short toast.
- Enabling the toggle shows the accessibility-required dialog if the service is off.
