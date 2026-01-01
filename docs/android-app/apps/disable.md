# Disable

Where it lives:
- `app/src/main/java/com/tripleu/ui/fragments/UpdateAppsFragment.kt`
- `app/src/main/java/com/tripleu/policy/PolicyManager.kt`

What it does:
- Fully disables an app by hiding and suspending it.

How it runs:
- "Disable" calls `toggleAppBlock(..., true)` and `setAppSuspended(..., true)`.
- "Enable" clears both flags.
- Enable also marks the app approved (adds to `approved_apps` and `apps.approved`).
