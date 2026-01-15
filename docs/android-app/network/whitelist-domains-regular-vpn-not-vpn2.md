# Whitelist domains (regular VPN, not VPN2)

## Where it lives
- `app/src/main/java/com/tripleu/ui/fragments/PrivacyFragment.kt`
- `app/src/main/java/com/tripleu/ui/fragments/PrivacyDialogState.kt`
- `app/src/main/java/com/tripleu/ui/components/HostWhitelistDialogUi.kt`
- `app/src/main/java/com/tripleu/vpn/PcapVpnService.kt`
- `app/src/main/java/com/tripleu/vpn/DomainFilter.kt`
- `app/src/main/java/com/tripleu/vpn/Configuration.java`
- `app/src/main/java/com/tripleu/config/ConfigPoller.kt`

## What it does
- Enables domain allowlist mode inside `PcapVpnService`.
- Uses `Configuration.hosts` + `network.domain_whitelist_hosts` for the active list.
- Private DNS can stay enabled; the DNS host is auto-allowed.
- DNS/SNI/URL filtering only (no TLS decrypt).

## How domain filtering works
- `DomainFilter.reload(...)` parses the host list into allowed domains/URLs.
- Packets are checked via JNI callbacks using DNS/SNI/HTTP URL hints.
- Subdomains are allowed when the parent domain is in the list.

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
  - Starts/refreshes `PcapVpnService` after VPN consent.
- Toggle off runs `disableWhitelistMode()`:
  - Sets `hosts.enabled=false` and refreshes `PcapVpnService`.
  - Writes `network.domain_whitelist_enabled=false` and clears `network.domain_whitelist_hosts`.
- `PcapVpnService` applies whitelist decisions for every connection.
- Cloud config `network.domain_whitelist_enabled` + `network.domain_whitelist_hosts` are applied in `ConfigPoller` (skipped if `Vpn2State.shouldBlockLegacy(...)` is true).
- Entering whitelist mode clears `firewall_rules` so per-app network rules do not conflict.

## On boot
- `BootComplete` calls `checkStartPcapOnBoot(...)`.
- If `config.autoStart` is true and `hosts.enabled=true`, it starts `PcapVpnService`.
- Legacy VPN is skipped if `Vpn2State.shouldBlockLegacy(...)` is true.
