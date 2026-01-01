# Make suspended

## Where it lives
- `app/src/main/java/com/tripleu/ui/fragments/UpdateAppsFragment.kt`
- `app/src/main/java/com/tripleu/policy/PolicyManager.kt`

## What it does
- Suspends or unsuspends an app.

## How it runs
- "Suspend" calls `PolicyManager.setAppSuspended(..., true)`.
- "Unsuspend" calls `PolicyManager.setAppSuspended(..., false)`.
- Unsuspend also marks the app approved (adds to `approved_apps` and `apps.approved`).
