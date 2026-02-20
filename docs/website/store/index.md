# Store Tab (Website)

Store tab controls app request, approval, install, and update flows.

## Current Behavior

- Separate request and update contexts
- Refresh logic re-fetches data on tab context switches
- Install/update path is split-aware

## Troubleshooting

If update counts look stale, trigger refresh after switching context and verify backend response health.
