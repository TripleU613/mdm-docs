# Device binding

Where it lives:
- `app/src/main/java/com/tripleu/device/DeviceBindingManager.kt`

What it does:
- Enforces one-device-per-account using a device keypair.
- Uses Firebase Functions to claim and confirm the device.

How it runs:
- Generates an RSA keypair in AndroidKeyStore (`mdm_device_binding_key`).
- Uses the device ID from `FirestoreDevicePaths.deviceId()`.
- Calls Firebase Functions:
  - `requestDeviceBinding` (returns `deviceId` + `challenge`).
  - Signs the challenge with the private key.
  - `confirmDeviceBinding` to finalize binding.
- If binding fails, sign-in/sign-up is rejected and the user is signed out.
