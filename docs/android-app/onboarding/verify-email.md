# Verify email

## Where it lives
- `app/src/main/java/com/tripleu/ui/activities/VerifyPage.kt`
- `app/src/main/java/com/tripleu/ui/activities/RegisterActivity.kt`

## What it does
- Confirms the user has verified their email before entering the app.

## How it runs
- `RegisterActivity` routes existing unverified users to `verify_page`.
- The Verify screen calls `FirebaseAuth.currentUser.reload()`.
- If `isEmailVerified` is true:
  - Sets `Session.isAuthenticated = true`.
  - Starts `MainActivity`.
- Otherwise it shows a "not verified" toast.
