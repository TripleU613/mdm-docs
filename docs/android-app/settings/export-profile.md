# Export profile

## Where it lives
- `app/src/main/java/com/tripleu/ui/fragments/SettingsFragment.kt`
- `app/src/main/java/com/tripleu/config/ProfileBackupManager.kt`
- `app/src/main/java/com/tripleu/config/ConfigStore.kt`

## What it does
- Exports non-sensitive config entries to an encrypted file.
- Uses the file picker to create a file named `mdm_profile.tripleu`.
- Includes managed/approved app policies (hide/suspend/uninstall/network/webview/video + approval).

## How it runs
- `exportProfileLauncher` uses `CreateDocument("application/octet-stream")`.
- `ProfileBackupManager.export()`:
  - Reads all `ConfigStore` entries and filters out sensitive keys (`pin`, `auth`, `uid`, `email`, `snapshot.*`).
  - Writes a JSON array of `{key, value, type, updatedAtMs}`.
  - Adds an `apps` array for managed/approved apps only.
  - Encrypts the payload with AES/GCM before writing to the selected URI.
