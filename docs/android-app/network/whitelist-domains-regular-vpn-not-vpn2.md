# Whitelist domains (regular VPN, not VPN2)

## Where it lives
- `app/src/main/java/com/tripleu/ui/fragments/PrivacyFragment.kt`
- `app/src/main/java/com/tripleu/ui/fragments/PrivacyDialogState.kt`
- `app/src/main/java/com/tripleu/ui/components/HostWhitelistDialogUi.kt`
- `app/src/main/java/com/tripleu/vpn/WhitelistVpnService.kt`
- `app/src/main/java/com/tripleu/vpn/AdVpnThread.java`
- `app/src/main/java/com/tripleu/vpn/Configuration.java`
- `app/src/main/java/com/tripleu/dp/RuleDatabase.java`
- `app/src/main/java/com/tripleu/vpn/DnsPacketProxy.java`
- `app/src/main/java/com/tripleu/config/ConfigPoller.kt`

## What it does
- Enables the domain whitelist mode using `WhitelistVpnService` (extends `AdVpnService`).
- Uses `Configuration.hosts` as the active host list.
- Disables Private DNS and the main VPN toggle while whitelist mode is active.

## How domain filtering works
- `RuleDatabase.initialize(...)` loads allowed hosts when `config.hosts.enabled=true`.
- `DnsPacketProxy` checks `RuleDatabase.isAllowed(host)` for each DNS query:
  - Allowed domains are forwarded to upstream DNS.
  - Not allowed domains are answered with a negative response.
- Subdomains are allowed when the parent domain is in the list.
- Each `Configuration.Item` can be a single host or a file/URL; `RuleDatabase` parses hosts files when present.

## Import and edit
- The whitelist UI is `HostWhitelistDialogCard`.
- Manual input and file import both use `parseDomains(...)`:
  - Strips scheme/path/ports and `*.` wildcards.
  - Splits on commas, semicolons, and whitespace.
  - Deduplicates entries.
- File import uses the system picker (`OpenDocument`) and reads raw text.
- On save, entries are stored as `Configuration.Item` with `state=ALLOW`.

## How it runs
- Toggle on opens `HostWhitelistDialogCard` to add or import domains.
  - Input is normalized by `parseDomains` (strips scheme/path/ports and wildcards).
  - Required Firebase hosts are auto-added in `ensureRequiredWhitelistHosts(...)`.
- On save, `applyWhitelistSelection(...)`:
  - Writes hosts to config via `FileHelper` and to `ConfigStore` (`network.domain_whitelist_hosts`).
  - Sets `network.domain_whitelist_enabled=true`.
  - Stops `AdVpnService` if running and forces Private DNS off.
  - Starts `WhitelistVpnService` after VPN consent (`REQUEST_START_WHITELIST`).
  - Calls `RuleDatabaseUpdateTask` to refresh host rules.
- Toggle off runs `disableWhitelistMode()`:
  - Sets `hosts.enabled=false`, stops `WhitelistVpnService`, re-enables VPN/Private DNS toggles.
  - Writes `network.domain_whitelist_enabled=false` and clears `network.domain_whitelist_hosts`.
- `AdVpnThread` treats `hosts.enabled` as whitelist mode and routes all apps through the VPN so DNS filtering applies.
- Cloud config `network.domain_whitelist_enabled` + `network.domain_whitelist_hosts` are applied in `ConfigPoller` (skipped if `Vpn2State.shouldBlockLegacy(...)` is true).
- Entering whitelist mode clears `firewall_rules` so per-app network rules do not conflict.

## On boot
- `BootComplete` calls `AdVpnService.checkStartVpnOnBoot(...)`.
- If `config.autoStart` is true and `hosts.enabled=true`, it starts `WhitelistVpnService`.
- Legacy VPN is skipped if `Vpn2State.shouldBlockLegacy(...)` is true.
