# Policies at a glance

Where it lives:
- `app/src/main/java/com/tripleu/ui/fragments/HomeScreenContent.kt`
- `app/src/main/java/com/tripleu/ui/home/PolicySummaryProvider.kt`

What it does:
- Shows a summary card with active policy sections.
- Only enabled items render.
- Expand/collapse shows the per-section list.

Sections shown:
- System
- Installation
- Network
- Accessibility

Data source:
- `PolicySummaryProvider.build()` aggregates device restrictions, prefs, and app state.
- The UI builds sections with `buildPolicySections(summary)`.
- Uses `FirewallManager.getRules()` to count managed apps and per-app blocks.
- Uses `Hawk` flags for network lock (`isBlockNetwork`) and private DNS (`isPrivateDnsChecked`).
