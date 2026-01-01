# Screen capture dialog auto-accept

Where it lives:
- `app/src/main/java/com/tripleu/accessibility/ScreenCaptureDialogAutoAcceptor.kt`
- `app/src/main/java/com/tripleu/accessibility/AppBlockAccessibilityService.kt`

What it does:
- Auto-clicks the MediaProjection consent dialog (Start/Allow/OK).
- Makes remote support start faster without manual taps.

How it runs:
- Controlled by `AppBlockAccessibilityService.autoAcceptScreenCapture` (default true).
- On accessibility events, it checks dialog keywords in English/Hebrew.
- Clicks accept buttons or their clickable parent.
- Fallback: clicks any non-cancel button that looks like accept.
