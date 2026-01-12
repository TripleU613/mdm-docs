# PIN recovery

## Where it lives
- `app/src/main/java/com/tripleu/ui/activities/AuthActivity.kt`
- `app/src/main/java/com/tripleu/ui/activities/AccountLoginActivity.kt`
- `app/src/main/java/com/tripleu/ui/activities/ResetPinActivity.kt`

## Status
- Legacy only. Current builds validate PIN locally with a 5-attempt/5-minute lockout and do not call the server.

## Legacy behavior (for reference)
- Server-side recovery PIN validation via Firebase Function `validateRecoveryPin`.
- "Forgot PIN" flow:
  - Email + password login -> `ResetPinActivity` in recovery mode (`RECOVERY_RESET=true`).
  - "Forgot password" sends a Firebase reset email.
- `ResetPinActivity` sets a new 4+ digit PIN without the old PIN.
