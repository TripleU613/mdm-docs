# App update prompt

Where it lives:
- `app/src/main/java/com/tripleu/ui/fragments/HomeFragment.kt`
- `app/src/main/java/com/tripleu/ui/fragments/HomeScreenContent.kt`
- `app/src/main/java/com/tripleu/updates/AppReleaseChecker.kt`

What it does:
- Shows a modal when a newer app build is available.
- Actions: Download, Remind later, Never show.

How it runs:
- `HomeFragment.checkForAppRelease()` runs on resume and after manual checks.
- It calls `AppReleaseChecker.fetchLatestRelease()` and compares `versionCode`.
- Suppression prefs:
  - `app_update_remind_after` + `app_update_remind_version` (6 hour snooze).
  - `app_update_never_version` (never show for that version or lower).
- Download action calls `AppReleaseChecker.downloadAndInstall()`:
  - If device owner, uses silent install.
  - Otherwise starts the system installer via `FileProvider`.
- If a manual check finds no update, it shows a simple "no update" dialog.
