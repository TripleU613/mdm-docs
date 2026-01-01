# Whitelist summary card

Where it lives:
- `app/src/main/java/com/tripleu/ui/fragments/HomeFragment.kt`
- `app/src/main/java/com/tripleu/ui/fragments/HomeScreenContent.kt`
- `app/src/main/java/com/tripleu/vpn/Configuration.java`

What it does:
- Shows that domain whitelist is active and lists allowed domains.
- Hides internal Firebase and emulator hosts from the display.

How it runs:
- `HomeFragment.buildWhitelistSummary()` reads `MainActivity.config.hosts`.
- Each `Configuration.Item` is mapped with `toDisplayLabel()`:
  - Prefers `location` unless it is `content://`.
  - Falls back to `title`.
  - Skips known internal hosts.
- `WhitelistCard` shows up to 8 domains and a "+X more" line when needed.
