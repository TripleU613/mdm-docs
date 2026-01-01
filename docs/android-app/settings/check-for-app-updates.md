# Check for app updates

## Where it lives
- `app/src/main/java/com/tripleu/ui/fragments/SettingsFragment.kt`
- `app/src/main/java/com/tripleu/updates/AppReleaseChecker.kt`
- `app/src/main/java/com/tripleu/updates/HomeUpdateBridge.kt`

## What it does
- Checks for a newer app release.
- Triggers the Home update prompt when a newer build is found.

## How it runs
- Calls `AppReleaseChecker.fetchLatestRelease()` which posts to:
  - `https://getlatestgithubrelease-xjmaoa4a5a-uc.a.run.app`
  - Repo: `TripleU613/TripleUMDM_Public`
- Compares the remote `versionCode` with the installed app version.
- If newer, calls `HomeUpdateBridge.triggerManualCheck(...)` to start the update flow.
- The Home dialog uses `AppReleaseChecker.downloadAndInstall()` for the download/install step.
