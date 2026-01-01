# Block uninstall

Where it lives:
- `app/src/main/java/com/tripleu/ui/fragments/UpdateAppsFragment.kt`
- `app/src/main/java/com/tripleu/policy/PolicyManager.kt`

What it does:
- Prevents or allows uninstall for a specific app.

How it runs:
- "Block uninstall" calls `PolicyManager.setUninstallBlocked(..., true)`.
- "Allow uninstall" calls `PolicyManager.setUninstallBlocked(..., false)`.
