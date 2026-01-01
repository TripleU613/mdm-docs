# Add WebView exception

## Where it lives
- `app/src/main/java/com/tripleu/ui/fragments/UpdateAppsFragment.kt`
- `app/src/main/java/com/tripleu/network/FirewallManager.kt`
- `app/src/main/java/com/tripleu/accessibility/InAppBrowserBlocker.kt`

## What it does
- Allows a specific app to use WebView when global WebView blocking is on.

## How it runs
- Option only appears when `webview_block_all=true`.
- "Add WebView exception" stores the package in `firewall_rules` -> `webview_exceptionlist`.
- `InAppBrowserBlocker` skips blocking for exception packages when global block is on.
