# Installation Tab

Installation tab controls app install/update behavior and install gate policy.

## Main Use Cases

- Define install permissions and restrictions for managed devices.
- Control whether users can launch newly detected/unapproved apps.
- Coordinate managed installs with Store and Apps policy.

## Current Behavior

- Managed install/update pipeline supports split-aware installs.
- Device-specific ABI handling is applied during package install workflows.
- Install failures are surfaced in logs and should be reviewed before retry loops.
