# Onboarding overview

## Where it lives
- `app/src/main/java/com/tripleu/ui/activities/RegisterActivity.kt`
- `app/src/main/java/com/tripleu/ui/activities/AuthActivity.kt`
- `app/src/main/java/com/tripleu/ui/activities/AuthComponents.kt`
- `app/src/main/java/com/tripleu/ui/activities/PermissionsCheckActivity.kt`
- `app/src/main/java/com/tripleu/MainActivity.kt`

## What it does
- Guides a new user from account creation to device-owner setup.
- Enforces email verification, device binding, and MDM PIN before the main app opens.

## Flow summary
- Welcome -> Sign in / Sign up (RegisterActivity nav flow).
- Email verification (VerifyEmailScreen).
- Device binding (DeviceBindingManager).
- MDM PIN gate (AuthActivity).
- Required permissions + device owner setup (PermissionsCheckActivity).
- Main app (MainActivity) only after `setup_complete=true`.

## RegisterActivity routing
- If a user is signed in and verified, it jumps to `AuthActivity` or `MainActivity` (based on `Session.isAuthenticated`).
- If signed in but unverified, it starts at `verify_page`.
- Otherwise it starts at `welcome_page`.

## MainActivity gates
- If `Session.isAuthenticated` is false -> `AuthActivity`.
- If user is missing or email is unverified -> `AuthActivity`.
- If `setup_complete=false` -> `PermissionsCheckActivity`.
- If the signed-in email exists in Firestore `bannedEmails/{email}`, it clears device owner and starts uninstall.
