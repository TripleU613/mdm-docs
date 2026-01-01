# Sign in

Where it lives:
- `app/src/main/java/com/tripleu/ui/activities/LoginPage.kt`
- `app/src/main/java/com/tripleu/device/DeviceBindingManager.kt`

What it does:
- Signs in with email + password.
- Captures a 4+ digit MDM PIN.
- Enforces one-device-per-account.

How it runs:
- Uses `FirebaseAuth.signInWithEmailAndPassword`.
- Requires a non-empty PIN (min length 4).
- Runs `DeviceBindingManager.ensureDeviceBound()`.
- On success:
  - Sets `Session.isAuthenticated = true`.
  - Stores `mdm_pin` in `MDMSettings`.
  - Navigates to `MainActivity`.
