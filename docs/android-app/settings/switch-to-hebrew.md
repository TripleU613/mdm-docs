# Switch to Hebrew

Where it lives:
- `app/src/main/java/com/tripleu/ui/fragments/SettingsFragment.kt`

What it does:
- Toggles the app language between English and Hebrew.
- Saves the choice in `ConfigStore` under `settings.language`.

How it runs:
- `toggleLanguage()` picks `en` or `iw` based on `isCurrentLocaleHebrew()`.
- Calls `AppCompatDelegate.setApplicationLocales(...)`.
- Recreates the activity to apply the new locale.
