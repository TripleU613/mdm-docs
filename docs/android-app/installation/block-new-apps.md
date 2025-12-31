# Block new apps

Where it lives:
- `app/src/main/java/com/tripleu/ui/fragments/PrivacyFragment.kt`
- `app/src/main/java/com/tripleu/appcontrol/AppInstallReceiver.kt`
- `app/src/main/java/com/tripleu/appcontrol/NewAppDetector.kt`
- `app/src/main/java/com/tripleu/appcontrol/NewAppDetectorWorker.kt`
- `app/src/main/java/com/tripleu/appcontrol/AppMonitorService.kt`
- `app/src/main/java/com/tripleu/appcontrol/AppMonitorUtils.kt`
- `app/src/main/java/com/tripleu/ui/fragments/UpdateAppsFragment.kt`
- `app/src/main/java/com/tripleu/config/ConfigPoller.kt`
- `app/src/main/java/com/tripleu/vpn/AdVpnService.java`
- `app/src/main/java/com/tripleu/vpn/AdVpnServiceKt.kt`

What it does:
- When enabled, newly installed apps are hidden + suspended unless approved.
- Update installs are ignored (`Intent.EXTRA_REPLACING`).
- Detected apps are mirrored into local snapshot + Firestore for review.

How it works:
- Toggle calls `handleBlockNewAppsToggle` and sets `block_new_apps` (prefs) + `apps.block_new_apps` (`ConfigStore`).
- On enable:
  - Seeds `known_installed_packages` (current launchable apps).
  - Starts `AppMonitorService` (foreground; checks every ~20s).
  - Schedules `NewAppDetector` (WorkManager; every 15 minutes).
- Detection paths:
  - `AppInstallReceiver` catches `ACTION_PACKAGE_ADDED` and blocks any new package not in approvals.
  - `AppMonitorService` calls `AppMonitorUtils.monitorOnce()` to compare `known_installed_packages` vs current launchable apps.
  - `NewAppDetectorWorker` scans for new launchable apps and checks Firestore approval before blocking.
  - `AdVpnService.monitorUserAppsOnce()` also runs when VPN is active.
- When a new unapproved app is found:
  - `PolicyManager.toggleAppBlock(..., true)` + `PolicyManager.setAppSuspended(..., true)`.
  - Writes a pending app record to `AppSnapshotStorage` and Firestore.
  - Receiver/worker paths trigger `CloudSyncManager.manualSync()`.

How approval works:
- Local approvals: `approved_apps` (prefs).
- Cloud approvals: `apps.approved` from `ConfigStore`, plus Firestore `devices/{deviceId}/apps/{package}` where `approved=true` or `hidden=false` + `suspended=false`.
- `UpdateAppsFragment` marks apps approved when you Unhide, Unsuspend, or Enable.
- `AppInstallReceiver` removes packages from `approved_apps` on uninstall.
- Approved apps are unblocked on each monitor pass.

Firestore/snapshot fields written:
- `deviceId`, `label`, `system`, `versionName`, `versionCode`.
- `hidden`, `suspended`, `uninstallBlocked`, `networkBlocked`, `webviewBlocked`, `webviewException`, `videoBlocked`, `approved`.
- `detectedAtMs`, `updatedAtMs`, `source`, `installed`, `managed`.
Note: `system` means "not launchable" (based on `getLaunchIntentForPackage`).

State stored:
- Prefs: `block_new_apps`, `approved_apps`, `known_installed_packages`.
- `ConfigStore`: `apps.block_new_apps`, `apps.approved`, `apps.known_installed`.
- Firestore: `devices/{deviceId}/apps/{package}`.
