# Gboard GIF search blocker

Where it lives:
- `app/src/main/java/com/tripleu/accessibility/GboardBlocker.kt`
- `app/src/main/java/com/tripleu/accessibility/AppBlockAccessibilityService.kt`

What it does:
- Closes the Gboard GIF/search media pane when enabled.

How it runs:
- Enabled by `gboard_gif_blocked=true` (prefs).
- Finds the Gboard window and detects a search bar + search icon.
- If detected, it triggers back three times to exit the pane.
