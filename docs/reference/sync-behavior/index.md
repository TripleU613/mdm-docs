# Sync Behavior

This page describes how website and device exchange config and app policy state.

## Config Read Path (Website)

1. Read cached config first.
2. If cache is fresh (<2 minutes), reuse cache.
3. Otherwise call `getDeviceConfig`.
4. Parse `entries[]` into typed dashboard config.
5. If `deviceUpdated` is true, acknowledge it by writing `deviceUpdated=false`.

## Apps Read Path (Website)

1. Read cached apps first.
2. Call `getDeviceAppsUpdatedTime`.
3. Refetch `listDeviceApps` only when timestamp changed or cache missing.
4. Normalize app fields (`jumpOut`, `timePolicy`, `timeControlled`, `managed`).

## Save Path (Website)

1. Build changed config entries only.
2. Write via `saveDeviceConfig`.
3. Build changed app rows and write via `saveDeviceApps`.
4. Optional legacy offline flags sync (`syncMasterOfflineFlagsDirectus`) when changed.

## Device Apply Path (Android)

- `ConfigPoller` applies changed keys based on newest entry timestamp.
- Policy groups apply in sequence: system, apps, accessibility, kiosk, network, settings, updates, approval, lockout.
- Time enforcement reconciles foreground service start/stop via `TimeManagementService.reconcile()`.

## Common Stale-State Causes

- Cache not invalidated after tab change.
- Device offline while cloud write succeeds.
- App list timestamp unchanged while operator expects new scan data.
