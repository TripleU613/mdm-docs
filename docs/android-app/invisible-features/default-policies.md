# Default policies (first-time setup)

Where it lives:
- `app/src/main/java/com/tripleu/policy/DefaultPolicyHandler.kt`
- `app/src/main/java/com/tripleu/ui/activities/PermissionsCheckActivity.kt`
- `app/src/main/java/com/tripleu/ui/fragments/PrivacyFragment.kt`

What it does:
- Applies one-time defaults after setup completes.
- Blocks network reset.
- Sets FRP accounts and organization branding.
- Enables accessibility self-block.
- Resets VPN and whitelist flags to off.

How it runs:
- Runs once when device owner is active (API 28+).
- Sets `UserManager.DISALLOW_NETWORK_RESET`.
- Calls `PolicyManager.setFrpAccounts(setOf("tripleuworld@gmail.com"))`.
- Calls `PolicyManager.setOrganizationBranding(...)` (org name + lock screen message).
- Writes prefs:
  - `network_reset_blocked=true`
  - `accessibility_self_block_enabled=true`
  - `default_policies_applied=true`
  - `is_vpn_on=false`
  - `whitelist_on=false`
