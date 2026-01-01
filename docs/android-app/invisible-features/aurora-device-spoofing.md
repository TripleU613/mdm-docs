# Aurora device spoofing

Where it lives:
- `app/src/main/java/com/tripleu/updates/PlayDeviceSpoofManager.kt`
- `app/src/main/java/com/tripleu/updates/NativeDeviceInfoProvider.kt`
- `app/src/main/java/com/tripleu/updates/PlayAuthStore.kt`
- `app/src/main/java/com/tripleu/updates/AuroraUpdateRepository.kt`

What it does:
- Builds a device profile used to authenticate with the Aurora GPlay API.
- Caches auth tokens and refreshes them periodically.

How it runs:
- `AuroraUpdateRepository` calls `PlayDeviceSpoofManager.initialize()` on init.
- `PlayDeviceSpoofManager` caches a Properties snapshot from `NativeDeviceInfoProvider`.
- Profile selection:
  - Uses a Pixel profile if the device is Huawei or not already Google-branded.
  - If the profile is still "native", it overwrites to Pixel 7 values and sets `Spoof.Profile=pixel7`.
- Auth data is cached in `play_update_auth` via `PlayAuthStore`.
- `AuroraUpdateRepository` refreshes auth if:
  - No cached token.
  - The token is older than 1 hour.
  - A validation call fails.
- On auth failure, it refreshes the spoof profile (`reason=auth_failure_<code>`).
