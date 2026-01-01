# App snapshot storage (apps collection)

Where it lives:
- `app/src/main/java/com/tripleu/config/AppSnapshotStorage.kt`
- `app/src/main/java/com/tripleu/appcontrol/AppInstallReceiver.kt`
- `app/src/main/java/com/tripleu/appcontrol/NewAppDetectorWorker.kt`
- `app/src/main/java/com/tripleu/ui/fragments/UpdateAppsFragment.kt`
- `app/src/main/java/com/tripleu/vpn/AdVpnService.java`
- `app/src/main/java/com/tripleu/vpn/AdVpnServiceKt.kt`

What it does:
- Mirrors per-app policy state into Firestore `devices/{deviceId}/apps/{package}`.
- Ensures `updatedAtMs` and `deviceId` are present on every write.
- `markApproved` sets `approved=true` and clears `hidden` + `suspended`.

How it runs:
- `upsertPackage()` merges fields with `SetOptions.merge()`.
- Called when:
  - New apps are detected and blocked.
  - Apps are approved or unblocked.
  - VPN/app policy changes are mirrored.
