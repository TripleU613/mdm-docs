# Allow user updates

Where it lives:
- `app/src/main/java/com/tripleu/ui/fragments/PrivacyFragment.kt`
- `app/src/main/java/com/tripleu/ui/activities/AuthActivity.kt`
- `app/src/main/java/com/tripleu/preferences/PreferenceKeys.kt`

What it does:
- Enables the Updates link on the PIN screen (AuthActivity).
- Opens `UpdatesGuestActivity`, which hosts `UpdatesFragment` (same Updates tab, including Update All).
- Stores the flag in prefs and `ConfigStore` (`apps.allow_user_updates`).

How it runs:
- Toggle calls `handleAllowUserUpdatesToggle`.
- `AuthActivity` reads the flag and shows a link to `UpdatesGuestActivity`.
