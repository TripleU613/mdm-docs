# Block default browsers

## Where it lives
- `app/src/main/java/com/tripleu/ui/fragments/PrivacyFragment.kt`
- `app/src/main/java/com/tripleu/network/BrowserPolicyManager.kt`
- `app/src/main/java/com/tripleu/policy/PolicyManager.kt`

## What it does
- Hides/suspends apps that can handle HTTP/HTTPS links.
- Disallows changing default apps on Android 14+ (`DISALLOW_CONFIG_DEFAULT_APPS`).
- Toggle is only shown on Android 14+.

## How it runs
- Toggle calls `BrowserPolicyManager.toggleBrowserDummyMode(...)`.
- Browser apps are discovered via `Intent.ACTION_VIEW` for `http://`.
- Each browser package is hidden + suspended, and the list is stored in `blocked_browser_packages`.
- Toggle writes `browser_dummy_mode_enabled` (prefs) and `accessibility.browser_dummy_mode` (`ConfigStore`).
