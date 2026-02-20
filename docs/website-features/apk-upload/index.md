# APK Upload and Assignment

APK upload supports controlled internal deployment.

## Runbook

1. Upload a signed artifact.
2. Confirm target ABI/split compatibility.
3. Assign to specific device or group.
4. Trigger install/update from managed flow.
5. Verify app launch and version result.

## Failure Modes

- Install succeeds but app crashes: wrong split/library set.
- Install never starts: assignment or fetch path mismatch.
- “Failed to fetch”: API endpoint health or auth/session problem.
