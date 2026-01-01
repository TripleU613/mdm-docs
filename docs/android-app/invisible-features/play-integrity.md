# Play Integrity checks

Where it lives:
- `app/src/main/java/com/tripleu/integrity/IntegrityCheckInitializer.kt`
- `app/src/main/java/com/tripleu/integrity/IntegrityVerificationHelper.kt`
- `app/src/main/java/com/tripleu/integrity/PlayIntegrityManager.kt`
- `app/src/main/java/com/tripleu/TripleUApp.kt`

What it does:
- Requests a Play Integrity token and verifies it via Firebase Functions.
- Runs in the background on app startup.

How it runs:
- `TripleUApp` sets the cloud project number and calls `initializeIntegrityChecks()`.
- `PlayIntegrityManager` requests a token from Play Integrity API.
- Token is sent to Firebase Function `verifyIntegrityToken` with `deviceId`.
- Results are handled asynchronously; app startup is not blocked.
