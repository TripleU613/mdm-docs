# Report portal share

Where it lives:
- `app/src/main/java/com/tripleu/ui/activities/ReportShareActivity.kt`
- `app/src/main/java/com/tripleu/ui/activities/ReportPortalActivity.kt`
- `app/src/main/AndroidManifest.xml`

What it does:
- Adds a Share target for URLs to open a local report portal.

How it runs:
- `ReportShareActivity` is exported for `ACTION_SEND` with `text/plain`.
- It extracts a URL from shared text and builds:
  - `http://10.9.0.1/.kvylock/appeal?mode=report&url=...&host=...`
- Launches `ReportPortalActivity` with that URL.
- `ReportPortalActivity` loads the portal URL in a WebView.
