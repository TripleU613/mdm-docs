# Permissions and Installation

TripleUMDM requires elevated permissions for full policy enforcement.

## Required Permissions

- Device Owner / Device Admin
- Accessibility Service
- Usage Access
- Overlay / Draw-over-apps (for enforcement overlays)
- Notification permission (status and background service visibility)
- Battery optimization exemption (recommended for reliability)

## Why They Matter

- Device Owner controls system-level restrictions.
- Accessibility enforces app-level UI blockers and jump-out actions.
- Usage access and overlays support app state detection and restriction.

## Validation Checklist

After setup, verify:

- Device owner is active.
- Accessibility service is active.
- Background services restart after app relaunch.
- Policy toggles from website are applied on device.
