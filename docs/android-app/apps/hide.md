# Hide

## Where it lives
- `app/src/main/java/com/tripleu/ui/fragments/UpdateAppsFragment.kt`
- `app/src/main/java/com/tripleu/policy/PolicyManager.kt`

## What it does
- Hides or unhides an app.

## How it runs
- "Hide" calls `PolicyManager.toggleAppBlock(..., true)`.
- "Unhide" calls `PolicyManager.toggleAppBlock(..., false)`.
- Unhide also marks the app approved (adds to `approved_apps` and `apps.approved`).
