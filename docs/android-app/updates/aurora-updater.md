# Aurora updater

## Where it lives
- `app/src/main/java/com/tripleu/ui/fragments/UpdatesFragment.kt`
- `app/src/main/java/com/tripleu/updates/UpdatesViewModel.kt`
- `app/src/main/java/com/tripleu/updates/AuroraUpdateRepository.kt`
- `app/src/main/java/com/tripleu/updates/AuroraUpdateInstallManager.kt`
- `app/src/main/java/com/tripleu/updates/PlayAuthStore.kt`
- `app/src/main/java/com/tripleu/updates/PlayHttpClient.kt`
- `app/src/main/java/com/tripleu/updates/PlayDeviceSpoofManager.kt`
- `app/src/main/java/com/tripleu/updates/UpdatesMuteStore.kt`

## What it does
- Lists available app updates using the Aurora GPlay API.
- Pull to refresh, search by name/package, update one or all.
- Expand a card to see version change, size, and changelog.
- Swipe to mute an update (hides it from the list).

## Requirements
- Android 9 (P) or higher.
- Device owner required for silent installs.

## How it runs
- `UpdatesViewModel.refresh()` builds the installed app list and calls `AuroraUpdateRepository.fetchAvailableUpdates(...)`.
- Repository uses Aurora `AppDetailsHelper` with cached auth from `PlayAuthStore`.
- Auth comes from `https://auroraoss.com/api/auth` and refreshes about every hour or when invalid.
- Updates are kept only if `versionCode` is newer than what's installed.
- `UpdatesMuteStore` filters muted packages and writes `updates.muted_packages` to `ConfigStore`.
- "Update All" only includes apps that are not already queued or installing.

## Install flow
- Tap Update adds the item to a queue (`UpdateStatus.QUEUED`), processed one-by-one.
- `resolveDownloadInfo()` uses Aurora `PurchaseHelper` to fetch base/split download URLs.
- `AuroraUpdateInstallManager` downloads slices to cache and installs via `PackageInstaller.Session`.
- If `DISALLOW_INSTALL_APPS` is active, it is temporarily disabled for the install and restored after ~3s.

## State and progress
- Status: `IDLE`, `QUEUED`, `DOWNLOADING`, `INSTALLING`, `SUCCESS`, `FAILED`.
- Progress appears on the action button and icon ring.
