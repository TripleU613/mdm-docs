# PIN recovery

Where it lives:
- `app/src/main/java/com/tripleu/ui/activities/AuthActivity.kt`
- `app/src/main/java/com/tripleu/ui/activities/AccountLoginActivity.kt`
- `app/src/main/java/com/tripleu/ui/activities/ResetPinActivity.kt`

What it does:
- Provides two recovery paths:
  - Server-side recovery PIN validation.
  - Email + password verification to reset the PIN.

How it runs:
- When PIN verification fails or `is_locked_out=true`, AuthActivity calls:
  - Firebase Function `validateRecoveryPin` with `{ deviceId, enteredPin }`.
  - If no user is logged in, it signs in anonymously first.
  - On success, clears `is_locked_out` and `mdm_pin`, then restarts AuthActivity.
- "Forgot PIN" opens `AccountLoginActivity`:
  - Verifies email + password with Firebase Auth.
  - Launches `ResetPinActivity` in recovery mode (`RECOVERY_RESET=true`).
  - Has a "Forgot password" link that sends a Firebase reset email.
- `ResetPinActivity` lets the user set a new 4+ digit PIN without the old PIN.
