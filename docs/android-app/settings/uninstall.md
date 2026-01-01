# Uninstall

## Where it lives
- `app/src/main/java/com/tripleu/ui/fragments/SettingsFragment.kt`
- `app/src/main/java/com/tripleu/policy/PolicyManager.kt`

## What it does
- Reverts all MDM policies and removes the app as device owner.
- Launches the system uninstall flow for the app.

## How it runs
- `showUninstallDialog()` asks for confirmation (annotated `@RequiresApi(Q)`).
- On confirm:
  - `PolicyManager.revertAllPolicies()` clears user restrictions, app blocks, Always-On VPN, and stored prefs (`MDMSettings`, `firewall_rules`).
  - Calls `DevicePolicyManager.clearDeviceOwnerApp(...)`.
  - Starts `Intent.ACTION_DELETE` for the package.
