# Time Management Tab (Website)

Website Time Management configures per-app schedule and countdown enforcement.

## Base Flow

1. Enable global `time_management.enabled`.
2. Add one or more apps.
3. Configure schedule windows and/or countdown timer.
4. Save and sync.

## Policy Behavior

- Multiple windows per app are supported.
- Base state is open/blocked; schedule windows invert that base state.
- Countdown supports two tick modes:
  - foreground only
  - always (foreground + background)

## Enforcement Result

When app access is not allowed, device exits the app and shows policy feedback toast.

## Operator Checks

- Confirm app row is marked time-controlled.
- Confirm policy exists in app snapshot.
- Confirm time-management service is running on device when policies exist.
