# Import whitelist

Where it lives:
- `app/src/main/java/com/tripleu/ui/fragments/SettingsFragment.kt`
- `app/src/main/java/com/tripleu/ui/components/HostWhitelistDialogUi.kt`
- `app/src/main/java/com/tripleu/dp/RuleDatabase.java`
- `app/src/main/java/com/tripleu/vpn/FileHelper.java`
- `app/src/main/java/com/tripleu/config/ConfigStore.kt`

What it does:
- Opens the domain whitelist editor used by the Network tab.
- Lets you import a list of domains from a text file.
- Saves the list into the VPN whitelist config.

How it runs:
- `launchHostFilePicker()` opens a file picker for `text/plain`, `text/*`, or `*/*`.
- `parseDomains()`:
  - Accepts one domain per line or comma/semicolon separated values.
  - Accepts hosts-file lines like `0.0.0.0 example.com`.
  - Strips schemes, paths, ports, and leading `*.` or `.`.
  - Keeps only valid hostnames and removes duplicates.
- `persistHostItems()`:
  - Merges your list with protected internal hosts (Firebase + emulator DNS).
  - Writes to `config.hosts.items` and `network.domain_whitelist_hosts` in `ConfigStore`.
  - Persists the config via `FileHelper.writeSettings(...)`.
