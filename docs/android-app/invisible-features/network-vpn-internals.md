# Network + VPN internals

## Host file auto-refresh

### Where it lives
- `app/src/main/java/com/tripleu/dp/RuleDatabaseUpdateJobService.java`
- `app/src/main/java/com/tripleu/dp/RuleDatabaseUpdateTask.java`
- `app/src/main/java/com/tripleu/dp/RuleDatabaseItemUpdateRunnable.java`
- `app/src/main/java/com/tripleu/vpn/SingleWriterMultipleReaderFile.java`
- `app/src/main/java/com/tripleu/ui/fragments/SettingsFragment.kt`

### What it does
- Automatically refreshes host files for the VPN rule database.
- Shows a progress notification and reports errors.

### How it runs
- `SettingsFragment` calls `RuleDatabaseUpdateJobService.scheduleOrCancel(...)`.
- If `config.hosts.automaticRefresh=true`, a daily JobScheduler task is set:
  - requires charging, idle, unmetered network.
- `RuleDatabaseUpdateTask` downloads each host source:
  - `content://` sources keep persisted read permission.
  - URL sources use HTTP with `If-Modified-Since`.
- On completion:
  - Re-initializes `RuleDatabase`.
  - Refreshes `AdVpnService` if running.
  - Stores errors in `RuleDatabaseUpdateTask.lastErrors` (shown in `MainActivity`).

## VPN watchdog keepalive

### Where it lives
- `app/src/main/java/com/tripleu/vpn/VpnWatchdog.java`
- `app/src/main/java/com/tripleu/vpn/AdVpnThread.java`

### What it does
- Sends empty UDP packets to keep the VPN DNS path alive.
- Detects no-response conditions and forces a reconnect.

### How it runs
- Initialized by `AdVpnThread` with `Configuration.watchDog`.
- Increases poll timeout on success and sends a ping.
- If no packets are received after a ping, it throws a `VpnNetworkException` to restart the VPN.

## Chrome SafeSearch enforcement

### Where it lives
- `app/src/main/java/com/tripleu/policy/ChromePolicyController.kt`
- `app/src/main/java/com/tripleu/policy/PolicyManager.kt`
- `app/src/main/java/com/tripleu/config/ConfigPoller.kt`

### What it does
- Forces Google SafeSearch in Chrome.
- Disables Chrome QUIC and DNS-over-HTTPS so filtering stays enforceable.

### How it runs
- `ConfigPoller` calls `PolicyManager.setChromeSafeSearch(..., true)` each poll.
- The controller sets application restrictions for installed Chrome packages:
  - `ForceGoogleSafeSearch=true`
  - `QuicAllowed=false`
  - `DnsOverHttpsMode=off`
  - `DnsOverHttpsTemplates=""`

## VPN2 WireGuard watcher

### Where it lives
- `app/src/main/java/com/tripleu/vpn2/Vpn2RemoteWatcher.kt`
- `app/src/main/java/com/tripleu/vpn2/Vpn2WireGuardManager.kt`
- `app/src/main/java/com/tripleu/vpn2/Vpn2State.kt`

### What it does
- Enables the premium WireGuard VPN when the portal allows it.
- Installs managed CA certs for VPN + MITM.
- Suspends legacy VPNs while VPN2 is active.

### How it runs
- Watches the device doc `devices/{deviceId}` for a `vpn` object.
- Requires `network.premium_vpn_enabled=true` plus:
  - `vpn.active=true`
  - valid `vpn.expiresAtMs`
  - non-empty WireGuard fields (`wgAddress`, `wgPort`, `wgServerPublicKey`).
- Generates/stores WireGuard private key in `vpn2_state` prefs.
- Uploads `vpn.wgPublicKey` if missing or outdated.
- Starts WireGuard with:
  - address `wgAddress/32`
  - endpoint `wgEndpoint` or `vpn.kvylock.com`
  - DNS from `wgDns` or derived from the address
  - excluded apps from `firewall_rules`.
- Installs CA certs from assets:
  - `kvylock.pem`
  - `mitmproxy-ca.pem`.
- Sets Always-On + lockdown while active.
