# Sign up

Where it lives:
- `app/src/main/java/com/tripleu/ui/activities/RegisterPage.kt`
- `app/src/main/java/com/tripleu/device/DeviceBindingManager.kt`

What it does:
- Creates a new Firebase account.
- Writes a basic user profile to Firestore.
- Enforces one-device-per-account.

How it runs:
- Validates name, phone, email, password, and PIN (4+ digits).
- Calls Firebase Function `isEmailAllowed`.
- Creates the user with `createUserWithEmailAndPassword`.
- Updates Firebase profile display name.
- Writes profile to `users/{uid}` with `imei = "PENDING"`.
- Runs `DeviceBindingManager.ensureDeviceBound()`.
- On success:
  - Stores `mdm_pin` in `MDMSettings`.
  - Sends email verification.
  - Navigates to `verify_page`.
