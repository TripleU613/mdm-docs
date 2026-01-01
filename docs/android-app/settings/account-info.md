# Account info

## Where it lives
- `app/src/main/java/com/tripleu/ui/fragments/SettingsFragment.kt`
- `app/src/main/java/com/tripleu/ui/fragments/SettingsUiContent.kt`

## What it does
- Shows the signed-in account email.
- Lets the user copy it to the clipboard.

## How it runs
- Reads `Firebase.auth.currentUser?.email` (falls back to `unknown_value`).
- `AccountInfoDialog` shows the email and a copy button.
- Copy uses `ClipboardManager` with a label.
