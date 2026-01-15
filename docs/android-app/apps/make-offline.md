# Make offline

## Where it lives
- `app/src/main/java/com/tripleu/ui/fragments/UpdateAppsFragment.kt`
- `app/src/main/java/com/tripleu/network/FirewallManager.kt`
- `app/src/main/java/com/tripleu/vpn/PcapVpnService.kt`

## What it does
- Blocks or unblocks network access for a single app.

## How it runs
- Option only appears when the VPN firewall is enabled (`is_vpn_on=true`).
- "Make offline" calls `FirewallManager.storeRule(package, true)`.
- "Allow network" calls `FirewallManager.storeRule(package, false)`.
- Each change triggers a VPN refresh to apply the rule.
