# Store Tab

Store tab covers managed app discovery, requests, installs, and updates.

## Modes

- **Admin mode**: direct package management and approvals.
- **User request mode**: user requests apps, admin reviews from dashboard.

## Update Pipeline Notes

- Store update/install flow is split-aware.
- Shared-library dependencies are handled during install workflow.
- Refresh behavior is tab-sensitive; switching context re-fetches current data.

## Operational Advice

- Validate update result against device logs for package-manager failures.
- If a package fails repeatedly, verify ABI/split compatibility and source metadata.
