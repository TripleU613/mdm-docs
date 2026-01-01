# Android app

Overview (growing list):

Home tab:
- Hi: greeting uses Firebase display name, else email prefix; includes Tech take of the day from Firestore `metadata/tech_take`.
- Policies at a glance: summary card grouped by System/Installation/Network/Accessibility.
- Did you know: hardcoded tip list rotated on each resume.
- Policies applied counter: count of enabled summary items.

System tab:
- Disallow adding users: applies `UserManager.DISALLOW_ADD_USER`.
- Disable factory reset: applies `UserManager.DISALLOW_FACTORY_RESET` and `DISALLOW_SAFE_BOOT`.
- Block developer options: applies `UserManager.DISALLOW_DEBUGGING_FEATURES`.
- Disable app settings control: applies `UserManager.DISALLOW_APPS_CONTROL`.
- Block phone calls: applies `UserManager.DISALLOW_OUTGOING_CALLS`.
- Disable SMS/MMS: applies `UserManager.DISALLOW_SMS`.

Installation:
- Disable APK install: applies `UserManager.DISALLOW_INSTALL_APPS`.
- Block new apps: hides + suspends new installs unless approved; detects via install receiver + monitor service + periodic worker; approvals from prefs + `ConfigStore` + Firestore `devices/{deviceId}/apps/{package}`.
- Allow user updates: shows the Updates link on the PIN screen to open the Updates tab (UpdatesGuestActivity).
- Block Play Store: hides `com.android.vending`.

Network tab:
- Disable tethering and hotspot: applies `UserManager.DISALLOW_CONFIG_TETHERING`.
- Block Wi-Fi: applies `UserManager.DISALLOW_CONFIG_WIFI` and stores `network.wifi_blocked`.
- Block all traffic: uses the VPN firewall and `isBlockNetwork` to block traffic; forces Wi-Fi block while active.
- Enable private DNS: sets `private_dns_mode` + hostname; requires `WRITE_SECURE_SETTINGS`.
- Enable VPN firewall: starts `AdVpnService`, sets Always-On, blocks VPN settings changes; per-app blocks use `firewall_rules`.
- Whitelist domains: runs `WhitelistVpnService`, disables Private DNS and main VPN toggle; DNS allowlist via `RuleDatabase`.

Accessibility tab:
- Android Auto quirk: returns Home on Google Search/Maps accessibility events.
- Block WhatsApp updates tab: exits if the Updates tab is selected.
- Block WhatsApp channels: detects channel UI and applies penalty timers.
- Block status: detects Status UI and exits (penalty timers).
- Block AI chats: blocks Meta AI, Gemini chats, and Google Photos Create.
- Block all in-app browsers: global mode blocks all except exception list; when off it only blocks per-app blocklist.
- Block default browsers: hides/suspends browser-capable apps; blocks default-app changes on Android 14+.

Apps tab:
- Users apps: launchable apps with no managed flags.
- System apps: non-launchable apps with no managed flags.
- Managed apps: any app with active policy flags.
- Actions: hide, suspend, disable, make offline (VPN), block in-app browser, add WebView exception, block video, block uninstall.

Updates tab:
- Aurora updater: lists available updates via Aurora GPlay API; pull to refresh, update all, swipe to mute; installs require device owner.

Settings tab:
- Switch to Hebrew: toggles app locale via AppCompatDelegate; stores `settings.language`.
- Export profile: writes encrypted ConfigStore export (no pins/auth/uid/email/snapshot).
- Import profile: decrypts and applies entries; warns if VPN consent is missing.
- Import whitelist: edits domain whitelist; parses domain lists and saves `network.domain_whitelist_hosts`.
- Account info: shows signed-in email and copy to clipboard.
- Privacy policy: opens in-app WebView to GitHub `Privacy.md`.
- Check for app updates: queries latest release and triggers manual update check.
- Support us: opens `https://tripleu.org/support`.
- App density: applies app-only density scale and stores percent.
- Muted updates: list of muted packages; unmute from dialog.
- Reset MDM PIN: changes PIN and updates `auth.pin_sha256`.
- Uninstall: reverts policies, clears device owner, starts uninstall.
- Delete my account: calls Firebase `deleteAccount`, signs out.
