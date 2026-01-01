# App density

## Where it lives
- `app/src/main/java/com/tripleu/ui/fragments/SettingsFragment.kt`
- `app/src/main/java/com/tripleu/ui/components/AppDensityDialog.kt`
- `app/src/main/java/com/tripleu/display/AppDensityManager.kt`

## What it does
- Changes the app UI density without touching system settings.
- Saves the selection so it persists after restart.

## How it runs
- `AppDensityDialog` lists options: Default (0), 20%, 25%, 50%, 75%, 100%.
- `AppDensityManager.applyDensity()`:
  - Stores the base DPI and target percent in `MDMSettings`.
  - Applies a scale factor and recreates the activity.
  - Factors: 20% -> 0.15, 25% -> 0.2, 50% -> 0.3, 75% -> 0.45, 100% -> 0.6.
- Settings also writes `settings.app_density_percent` to `ConfigStore`.
