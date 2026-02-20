# Store Tab (Website)

Store tab handles app request and update operations.

## Current Behavior

- Request and update views are separate contexts.
- Switching contexts should trigger a fresh fetch.
- Update/install flow is split-aware.

## Operator Runbook

1. Open **Updates** and refresh.
2. Apply selected updates.
3. Re-open updates to confirm remaining list.
4. If mismatch is reported, compare with device-side store list.

## Troubleshooting

- Only one update appears unexpectedly: force context switch and refresh.
- Install fails for large packages: verify required shared-library/split handling.
