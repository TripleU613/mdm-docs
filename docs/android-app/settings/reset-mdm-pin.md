# Reset MDM PIN

## Where it lives
- `app/src/main/java/com/tripleu/ui/fragments/SettingsFragment.kt`
- `app/src/main/java/com/tripleu/ui/activities/ResetPinActivity.kt`

## What it does
- Changes the MDM PIN.
- Requires the current PIN and a new 4+ digit PIN.

## How it runs
- Settings opens `ResetPinActivity`.
- `ResetPinActivity.resetPin()`:
  - Validates old PIN (unless in recovery mode).
  - Requires new PIN length >= 4 and confirmation match.
  - Stores `mdm_pin` and `mdm_pin_hash` in `MDMSettings`.
  - Writes `auth.pin_sha256` into `ConfigStore`.
