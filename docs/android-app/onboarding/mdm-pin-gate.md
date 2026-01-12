# MDM PIN gate

## Where it lives
- `app/src/main/java/com/tripleu/ui/activities/AuthActivity.kt`

## What it does
- Requires the MDM PIN before entering the app.
- Creates the PIN on first run if none exists.
- Shows a simple lockout after too many failures (local only).

## How it runs
- If `mdm_pin` is missing:
  - Prompts to set a new PIN.
  - Stores `mdm_pin` and `mdm_pin_hash` in `MDMSettings`.
  - Writes `auth.pin_sha256` to `ConfigStore`.
- If PIN exists:
  - Validates against `mdm_pin` or `mdm_pin_hash`.
  - On success, sets `Session.isAuthenticated = true` and routes to:
    - `PermissionsCheckActivity` if `setup_complete=false`.
    - `MainActivity` if setup is complete.
- If PIN fails:
  - Increments a local fail counter; after 5 failures, locks input for 5 minutes.
  - Resets the counter on success.
- No online recovery call is made anymore; validation is fully local.
- Shows an Updates link when `allow_user_updates=true` to open `UpdatesGuestActivity`.
- Provides a manual refresh button that calls `CloudSyncManager.manualSync()`.
- Shows the device ID label at the bottom of the screen.
