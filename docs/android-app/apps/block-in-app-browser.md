# Block in-app browser

## Where it lives
- `app/src/main/java/com/tripleu/ui/fragments/UpdateAppsFragment.kt`
- `app/src/main/java/com/tripleu/network/FirewallManager.kt`
- `app/src/main/java/com/tripleu/accessibility/InAppBrowserBlocker.kt`
- `app/src/main/java/com/tripleu/accessibility/AppBlockAccessibilityService.kt`

## What it does
- Blocks WebView/in-app browser usage for a specific app.

## How it runs
- "Block in-app browser" adds the package to `firewall_rules` -> `webview_blocklist`.
- `InAppBrowserBlocker` uses this list only when global WebView block is off.
- When WebView content is detected, it triggers a back action.
