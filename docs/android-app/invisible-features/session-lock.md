# Session lock

Where it lives:
- `app/src/main/java/com/tripleu/session/Session.kt`
- `app/src/main/java/com/tripleu/TripleUApp.kt`

What it does:
- Locks the app when it leaves the foreground.
- Allows short background grace periods for system pickers.

How it runs:
- `Session.activityResumed()` and `activityPaused()` track foreground state.
- `AUTH_TIMEOUT_MS` is 0, so auth resets immediately when the app backgrounds.
- `allowBackgroundFor()` delays lock for ~10s (file pickers, VPN consent).
- `TripleUApp.SessionLifecycleCallbacks` skips auth tracking for login/setup screens.
