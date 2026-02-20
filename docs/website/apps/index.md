# Apps Tab (Website)

Apps tab is the per-package policy surface.

## What You Can Manage

- Hide/unhide
- Suspend/unsuspend
- Disable/enable (where supported)
- Jump-out policy
- Network include/exclude flags
- Kiosk allowlist state
- Time-control visibility and cleanup

## Time-Control Integration

- Apps with saved time policy are marked as time-controlled.
- Clearing time control removes policy and updates app snapshot state.

## Troubleshooting

- App policy appears inconsistent: refresh apps list and verify `managed` and policy flags.
- Icon missing: verify icon exists in backend app snapshot for that package.
