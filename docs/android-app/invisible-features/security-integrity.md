# Security + integrity

## Remote uninstall flag

### Where it lives
- `app/src/main/java/com/tripleu/MainActivity.kt`

### What it does
- Allows the portal to trigger an uninstall via a Firestore flag.

### How it runs
- Listens to `users/{uid}` for `pendingUninstall`.
- If true:
  - Clears the flag (`pendingUninstall=false`).
  - Reverts policies and clears device owner.
  - Starts `Intent.ACTION_DELETE` for the app package.

## Blocked email uninstall

### Where it lives
- `app/src/main/java/com/tripleu/MainActivity.kt`

### What it does
- Forces uninstall if the signed-in email is in the blocked list.

### How it runs
- Reads Realtime DB `blockedEmails` once on launch.
- If the current email is in the list and the app is device owner:
  - Reverts policies and clears device owner.
  - Starts `Intent.ACTION_DELETE` for the app package.

## Play Integrity checks

### Where it lives
- `app/src/main/java/com/tripleu/integrity/IntegrityCheckInitializer.kt`
- `app/src/main/java/com/tripleu/integrity/IntegrityVerificationHelper.kt`
- `app/src/main/java/com/tripleu/integrity/PlayIntegrityManager.kt`
- `app/src/main/java/com/tripleu/TripleUApp.kt`

### What it does
- Requests a Play Integrity token and verifies it via Firebase Functions.
- Runs in the background on app startup.

### How it runs
- `TripleUApp` sets the cloud project number and calls `initializeIntegrityChecks()`.
- `PlayIntegrityManager` requests a token from Play Integrity API.
- Token is sent to Firebase Function `verifyIntegrityToken` with `deviceId`.
- Results are handled asynchronously; app startup is not blocked.
