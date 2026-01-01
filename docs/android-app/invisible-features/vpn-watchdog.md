# VPN watchdog keepalive

Where it lives:
- `app/src/main/java/com/tripleu/vpn/VpnWatchdog.java`
- `app/src/main/java/com/tripleu/vpn/AdVpnThread.java`

What it does:
- Sends empty UDP packets to keep the VPN DNS path alive.
- Detects no-response conditions and forces a reconnect.

How it runs:
- Initialized by `AdVpnThread` with `Configuration.watchDog`.
- Increases poll timeout on success and sends a ping.
- If no packets are received after a ping, it throws a `VpnNetworkException` to restart the VPN.
