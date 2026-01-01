# System apps

Where it lives:
- `app/src/main/java/com/tripleu/ui/fragments/UpdateAppsFragment.kt`
- `app/src/main/java/com/tripleu/network/FirewallManager.kt`

What it does:
- Shows non-launchable apps with no active management flags.

How it runs:
- `loadInstalledApps()` pulls app data via `FirewallManager.getRules(...)`.
- Apps with any managed flag are routed to the Managed tab.
- Remaining apps without a launch intent are shown here.
- Search filters by label or package name.
