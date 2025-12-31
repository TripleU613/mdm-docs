# Android app

## Accessibility module (start here)

Purpose: enforce content and feature blocks using Android accessibility APIs.

### Where it lives
- `app/src/main/java/com/tripleu/accessibility/`
- `app/src/main/res/xml/accessibility_service_config.xml`
- `app/src/main/AndroidManifest.xml` (service declarations)

### Services and config
- `AppBlockAccessibilityService`: the main `AccessibilityService`.
- `AccessibilityMonitorService`: a foreground service that watches system settings and attempts to re-enable the accessibility service if it is off.
- `accessibility_service_config.xml`: listens to `TYPE_WINDOW_STATE_CHANGED` and `TYPE_WINDOW_CONTENT_CHANGED`, can retrieve window content, and can perform gestures.

### Preferences used
Stored in `MDMSettings` (main prefs) unless noted.
- `whatsapp_updates_blocked`: block WhatsApp "Updates" tab.
- `ai_chat_blocked`: block in-app AI surfaces.
- `whatsapp_channels_blocked`: block WhatsApp Channels (uses penalty timers).
- `whatsapp_status_blocked`: block WhatsApp Status (uses penalty timers).
- `accessibility_self_block_enabled`: prevent disabling the accessibility service in Settings.
- `android_auto_quirk_enabled`: immediate HOME on specific Google apps.
- `gboard_gif_blocked`: block Gboard GIF search UI.
- `webview_block_all` (firewall prefs): block all in-app webviews except exceptions.
- `webview_blocklist` (firewall prefs): block specific app package names.
- `webview_exceptionlist` (firewall prefs): allowlist when `webview_block_all` is true.
- `video_blocklist` (firewall prefs): block video surfaces for listed packages.

### High-level flow
- Service starts, loads preferences, initializes detectors, and starts a poll loop.
- Each window state/content change is debounced per package to reduce scanning.
- Auto-accepts screen capture dialogs when enabled.
- Runs AI / video detectors, WhatsApp detectors, Settings self-blocker, and in-app browser blocker.
- Gboard GIF blocking runs after each event using the current preference flag.
- A 600 ms poll loop re-checks the active window for WhatsApp surfaces.

### Class and function reference

#### AppBlockAccessibilityService
Main dispatcher for all accessibility-based enforcement.

- `onServiceConnected()`: initializes shared prefs, detectors, and starts the polling loop. Registers preference change listener and updates timer state.
- `onAccessibilityEvent(event)`: filters to window state/content changes, debounces per package, then:
  - applies the Android auto-quirk (HOME on certain apps) when enabled
  - auto-accepts MediaProjection dialogs
  - runs AI/video detectors
  - handles WhatsApp blocks, Settings self-block, and in-app browser blocks
  - triggers Gboard GIF blocking
- `handleSettings(rootNode)`: uses `AccessibilitySelfBlocker` to block the Settings toggle screen for this service.
- `handleAiDetectors(packageName, node)`: runs `AiContentBlocker` if enabled, and `VideoDetector` when package name is listed in `video_blocklist`.
- `handleWhatsApp(rootNode)`: enforces WhatsApp penalties, blocks channels/status, and blocks the Updates tab when enabled.
- `injectTap(x, y)`: sends a tap gesture at screen coordinates via `dispatchGesture`.
- `pollCurrentWindow()`: re-runs WhatsApp handling on the active window when needed.
- `updatePenaltyTimerState(channelEnabled, statusEnabled)`: enables or resets penalty timers based on config.
- `maybeEnforceWhatsAppSuspension(timersEnabled)`: enforces a suspension if a timer is active.
- `requestScreenshot(callback)`: uses the Android 13+ `takeScreenshot` API; returns `null` on older OS versions or on failure.
- `onInterrupt()`: no-op.
- `onDestroy()`: clears the singleton instance, resets penalties, unregisters listeners, and stops polling.

Companion helpers:
- `instance`: holds the active service instance for static access.
- `autoAcceptScreenCapture`: global toggle used by `ScreenCaptureDialogAutoAcceptor`.
- `requestScreenshot(callback)`: static wrapper that returns `null` when the service is not running.

#### AccessibilityMonitorService
Foreground watchdog that attempts to keep the accessibility service enabled.

- `onCreate()`: starts foreground mode and registers a settings observer.
- `onStartCommand()`: re-checks settings and keeps the service sticky.
- `checkServiceEnabled()`: builds the service ID and writes it into `Settings.Secure` if missing.
- `ensureForeground()`: starts a minimal foreground notification using `NotificationChannels.SERVICE_RUNNING`.
- `onDestroy()`: unregisters the observer and stops foreground mode.
- `onBind()`: returns null (not a bound service).

Notes:
- Writing `Settings.Secure.ENABLED_ACCESSIBILITY_SERVICES` can fail depending on device policy; failures are caught and ignored.

#### AccessibilityNodeUtils
Utility to search a node tree for matching text or content descriptions.

- `containsText(node, keywords, depth, maxDepth)`: depth-first scan with a max depth cap; returns true on first match.

#### AccessibilitySelfBlocker
Blocks navigation to the app's accessibility toggle.

- `maybeBlock(rootNode)`: if enabled, checks for both the app name and the toggle text, then triggers a BACK action.

#### InAppBrowserBlocker
Detects and blocks embedded browser surfaces.

- `handle(packageName, rootNode)`: decides whether to block based on prefs, detects WebView/chrome elements, and triggers BACK.
- `detectWebViewContent(rootNode, packageName)`: combines package, class, and UI checks for a WebView-like surface.
- `isWebViewNode(node)`: checks class names against known WebView classes.
- `scanForWebView(node, depth)`: recursive search for WebView nodes.
- `hasBrowserChromeElements(node, depth)`: looks for URL bars and browser toolbar IDs.
- `findViewByContentDescriptionAndGoBack(node, descriptions, depth)`: backs out when a close/done/dismiss button is found.

#### GboardBlocker
Closes Gboard's GIF search pane when blocking is enabled.

- `handle(shouldBlock)`: looks for search UI in the Gboard window and issues back actions when detected.
- `nodeTreeHasSearchIcon(node, depth)`: searches for an image-based search icon in the node tree.

#### ScreenCaptureDialogAutoAcceptor
Auto-accepts MediaProjection screen capture dialogs.

- `tryAutoAccept(packageName, rootNode)`: detects screen capture dialogs via keywords, clicks the accept button, and falls back to generic accept heuristics.
- `findAllClickableNodes(node)`: returns all clickable nodes for fallback scanning.

#### AiContentBlocker
Blocks AI-related surfaces in specific apps.

- `detectAndBlock(root)`: runs Meta AI, Gemini, and Photos detectors; returns true on any block.
- `detectMetaAiAndBlock(root)`: identifies Meta AI chat or discovery surfaces and exits the app.
- `evaluateMetaAiSurface(root)`: returns chat/discover/none based on token and entry field checks.
- `findMetaAiText(root)`: BFS scan for Meta AI keywords with a node cap.
- `findMetaAiEntryField(root)`: BFS scan for entry fields, excluding search/filter inputs.
- `isMetaAiComposerField(node)`: checks view IDs, editability, and exclusion tokens.
- `detectMetaAiDiscoverSurface(root)`: heuristic scan for discovery surface cues.
- `detectGeminiAndBlock(root)`: blocks Gemini conversations in Google Messages.
- `isGeminiConversation(root)`: validates the conversation surface and avoids list/settings screens.
- `isMessagesConversationList(root)`: detects the main conversation list.
- `findGeminiEntryField(root)`: finds editable composer hints or IDs.
- `isMessagesSettingsScreen(root)`: detects settings via token threshold.
- `findNodeMatchingAnyText(root, tokens, maxDepth)`: limited-depth BFS for matching text.
- `isNodeNearTop(node)`: checks if a node is near the top of the screen.
- `hasGeminiCheckmarkBadge(anchorNode)`: checks for badge-like indicators near the header.
- `detectPhotosCreateTabAndBlock(root)`: blocks Google Photos "Create" surfaces.
- `hasCreateYoursButton(node)`: shallow tree search for the "Create yours" button.
- `hasPhotosCreationFeature(node)`: shallow scan for creation features.
- `isPhotosCreateTabSelected(node)`: checks the Create tab selection state.
- `findPhotosCreateTabNode(node, depth)`: recursive search for the Create tab UI.
- `findTextInShallowTree(node, searchText, maxDepth, depth)`: bounded-depth text search.
- `blockAndExit(message, backPressesBeforeHome, cooldownTracker)`: shows a toast (cooldown), performs back actions, then HOME.

### External dependencies used by accessibility
- `WhatsAppPenaltyManager`, `WhatsAppChannelDetector`, `WhatsAppStatusDetector` (package: `com.tripleu.whatsapp`)
- `VideoDetector` (package: `com.tripleu.video`)

## Next
Tell me which folder to document next (vpn, policy, config, ui, or something else).
