# State Indicators

This page explains common dashboard status flags and how they are computed.

## Config Meta Flags

| Flag | Meaning |
| --- | --- |
| `cloudUpdated` | Latest change was written from admin/dashboard side. |
| `deviceUpdated` | Device reported update that cloud has not acknowledged yet. |
| `updatedAtMs` | Last config write timestamp. |
| `lastSeenMs` | Last device heartbeat timestamp. |

## App-Level Derived Flags

| Field | How it is determined |
| --- | --- |
| `timeControlled` | True when valid time policy exists for app. |
| `managed` | True if any control is active (hide/suspend/jumpOut/network/webview/vpn/kiosk/time). |
| `jumpOut` | Includes explicit jump-out and time-command jump-out outcomes. |

## Time-Management Indicators

- Timer fulfillment adds package to jump-out sets:
  - `policy_jumpout_apps`
  - `policy_time_command_jumpout_apps`
- When policy is cleared, package is removed from both sets and snapshot is synced.

## Why UI May Not Match Expectation

- Config changed but device not yet polled/applied.
- Apps cache shown before fresh fetch finishes.
- Policy exists in pending changes but not yet saved.
