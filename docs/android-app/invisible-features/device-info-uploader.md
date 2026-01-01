# Device info uploader (IMEI)

Where it lives:
- `app/src/main/java/com/tripleu/device/DeviceInfoUploader.kt`

What it does:
- Uploads the device IMEI to Firestore for the signed-in user.

How it runs:
- Only runs when:
  - Firebase user is signed in.
  - App is device owner.
  - `READ_PHONE_STATE` permission is granted.
- Reads IMEI via `TelephonyManager.imei`.
- Writes to `users/{uid}.imei` and caches `imei_last` + `imei_uploaded` in `MDMSettings`.
