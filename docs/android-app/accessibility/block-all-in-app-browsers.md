# Block all in-app browsers

Where it lives:
- `app/src/main/java/com/tripleu/ui/fragments/PrivacyFragment.kt`
- `app/src/main/java/com/tripleu/accessibility/AppBlockAccessibilityService.kt`
- `app/src/main/java/com/tripleu/accessibility/InAppBrowserBlocker.kt`
- `app/src/main/java/com/tripleu/network/FirewallManager.kt`

What it does:
- Blocks WebView/in-app browser surfaces by backing out of the current screen.
- In global mode, blocks all apps except those in the WebView exception list.

How it runs:
- Toggle sets `webview_block_all` (prefs) and `accessibility.webview_block_all` (`ConfigStore`).
- `InAppBrowserBlocker` reads:
  - Prefs `firewall_rules` -> `webview_blocklist` for per-app blocks.
  - Prefs `firewall_rules` -> `webview_exceptionlist` for per-app exceptions.
- It detects WebView content (class names, known browser packages, or URL bar/toolbar IDs).
- When detected, it calls `GLOBAL_ACTION_BACK` (or tries a close button) to exit.
- Enabling the toggle shows the accessibility-required dialog if the service is off.
