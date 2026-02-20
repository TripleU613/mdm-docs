# Home Tab (Website)

Home is the first triage screen for a single device.

## What to Check First

- Device identity and last known online state
- Policy badges and critical restrictions
- Remote access and operator action shortcuts
- Recent sync freshness

## Standard Triage Flow

1. Confirm the selected device ID/name is correct.
2. Verify online/offline state.
3. Check whether policy has pending changes.
4. If state looks stale, refresh config/apps data and re-check badges.

## If Data Looks Stale

- Refresh once after tab switch.
- Verify backend health and device reachability.
- Compare with Apps and Settings tabs to confirm latest write timestamp.
