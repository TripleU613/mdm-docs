# Managed apps

## Where it lives
- `app/src/main/java/com/tripleu/ui/fragments/UpdateAppsFragment.kt`
- `app/src/main/java/com/tripleu/network/FirewallManager.kt`
- `app/src/main/java/com/tripleu/appcontrol/AppInfo.kt`

## What it does
- Shows apps with any active management flag.

## Managed flags
- Hidden
- Suspended
- Network blocked
- Uninstall blocked
- WebView blocked
- WebView exception
- Video blocked

## How it runs
- `loadInstalledApps()` pulls app data via `FirewallManager.getRules(...)`.
- If any flag above is true, the app appears here.
- Status dots are built by `buildIndicators(...)` and match the active flags.
