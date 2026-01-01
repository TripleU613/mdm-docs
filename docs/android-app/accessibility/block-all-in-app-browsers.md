# Block all in-app browsers

## Where it lives
- `app/src/main/java/com/tripleu/ui/fragments/PrivacyFragment.kt`
- `app/src/main/java/com/tripleu/accessibility/AppBlockAccessibilityService.kt`
- `app/src/main/java/com/tripleu/accessibility/InAppBrowserBlocker.kt`
- `app/src/main/java/com/tripleu/network/FirewallManager.kt`

## What it does
- Blocks WebView/in-app browser surfaces by backing out of the current screen.
- In global mode, blocks all apps except those in the WebView exception list.

## When disabled
- `webview_block_all=false`.
- Only apps in `firewall_rules.webview_blocklist` are blocked.
- This list is populated by the Apps tab action: "Block in-app browser".

## When enabled
- `webview_block_all=true`.
- All apps are blocked unless they are in `firewall_rules.webview_exceptionlist`.
- The exception list is populated by the Apps tab action: "Add WebView exception".

## How it runs
- Toggle sets `webview_block_all` (prefs) and `accessibility.webview_block_all` (`ConfigStore`).
- `InAppBrowserBlocker` reads:
  - Prefs `firewall_rules` -> `webview_blocklist` for per-app blocks.
  - Prefs `firewall_rules` -> `webview_exceptionlist` for per-app exceptions.
- `AppBlockAccessibilityService` calls `inAppBrowserBlocker.handle(...)` for most apps (not WhatsApp, Google Messages, or Settings).
- Detection signals:
  - Known browser packages.
  - WebView-related class names (`android.webkit.WebView`, `WebViewChromium`, `GeckoView`, etc.).
  - Browser chrome view IDs (URL bar/toolbar) or action labels containing "navigate", "url", "address".
- If WebView content is detected, it sends `GLOBAL_ACTION_BACK`.
- If not, it searches for clickable nodes with content descriptions like "close"/"done"/"dismiss" and then sends back.
- Enabling the toggle shows the accessibility-required dialog if the service is off.
