# Installation Tab (Website)

Installation tab manages app install governance and request approval flow.

## Main Actions

- Toggle **Block new apps** policy
- Review pending apps and approve/reject
- Keep approved and known-installed package sets aligned

## Recommended Flow

1. Keep `apps.block_new_apps` enabled for controlled fleets.
2. Review pending list daily.
3. Approve only required packages.
4. Reconcile approved list if user reports blocked updates.

## Failure Modes

- App remains paused after install: package still not approved.
- Approval appears saved but device unchanged: config sync delay or stale cache.
