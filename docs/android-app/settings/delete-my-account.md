# Delete my account

## Where it lives
- `app/src/main/java/com/tripleu/ui/fragments/SettingsFragment.kt`

## What it does
- Deletes the signed-in account via Firebase.
- Signs the user out and returns to the login screen.

## How it runs
- Shows a confirmation dialog.
- Calls Firebase Function `deleteAccount`.
- On success:
  - `Firebase.auth.signOut()`.
  - Starts `AuthActivity` with `NEW_TASK | CLEAR_TASK` and finishes the current activity.
- On failure, it shows a toast.
