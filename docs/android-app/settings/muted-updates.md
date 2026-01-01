# Muted updates

Where it lives:
- `app/src/main/java/com/tripleu/ui/fragments/SettingsFragment.kt`
- `app/src/main/java/com/tripleu/ui/fragments/SettingsUiContent.kt`
- `app/src/main/java/com/tripleu/updates/UpdatesMuteStore.kt`
- `app/src/main/java/com/tripleu/updates/UpdatesViewModel.kt`

What it does:
- Shows apps whose updates were muted in the Updates tab.
- Lets the user unmute them.

How it runs:
- `UpdatesMuteStore` stores muted package names in `updates_preferences` and mirrors them in `ConfigStore` as `updates.muted_packages`.
- `UpdatesViewModel` partitions updates into visible vs muted based on that set.
- `MutedUpdatesDialog` lists muted apps and calls `UpdatesMuteStore.unmute(...)`.
