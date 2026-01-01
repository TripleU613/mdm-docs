# Host file auto-refresh

Where it lives:
- `app/src/main/java/com/tripleu/dp/RuleDatabaseUpdateJobService.java`
- `app/src/main/java/com/tripleu/dp/RuleDatabaseUpdateTask.java`
- `app/src/main/java/com/tripleu/dp/RuleDatabaseItemUpdateRunnable.java`
- `app/src/main/java/com/tripleu/ui/fragments/SettingsFragment.kt`

What it does:
- Automatically refreshes host files for the VPN rule database.
- Shows a progress notification and reports errors.

How it runs:
- `SettingsFragment` calls `RuleDatabaseUpdateJobService.scheduleOrCancel(...)`.
- If `config.hosts.automaticRefresh=true`, a daily JobScheduler task is set:
  - requires charging, idle, unmetered network.
- `RuleDatabaseUpdateTask` downloads each host source:
  - `content://` sources keep persisted read permission.
  - URL sources use HTTP with `If-Modified-Since`.
- On completion:
  - Re-initializes `RuleDatabase`.
  - Refreshes `AdVpnService` if running.
  - Stores errors in `RuleDatabaseUpdateTask.lastErrors` (shown in `MainActivity`).
