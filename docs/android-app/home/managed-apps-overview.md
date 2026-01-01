# Managed apps overview

Where it lives:
- `app/src/main/java/com/tripleu/ui/fragments/HomeScreenContent.kt`
- `app/src/main/java/com/tripleu/ui/home/PolicySummaryProvider.kt`
- `app/src/main/java/com/tripleu/network/FirewallManager.kt`

What it does:
- Shows a Managed Apps card with totals and a breakdown of restrictions.
- Only shows when at least one managed count is non-zero.

How it runs:
- `PolicySummaryProvider.build()` counts:
  - total apps, managed apps.
  - hidden, suspended, uninstall blocked, network blocked, WebView blocked, video blocked.
- `ManagedAppsOverviewCard` renders totals and an expandable breakdown.
