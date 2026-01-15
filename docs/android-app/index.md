# Android app

## Overview
- Config lives in `ConfigStore` and syncs to `devices/{deviceId}/config/state/current/current`.
- Per-app policy lives in `devices/{deviceId}/apps/{package}` and is applied by `AppRemoteWatcher`.
- Remote commands come from `devices/{deviceId}/commands`.
- Website admin UI writes config/app policy; see `website`.
- Full path map + backend notes: `firestore-config`.

## Request map (Android -> backend)
- Firebase Auth: sign in, sign up, verify email, password reset.
- Firebase Functions: device binding, recovery PIN, delete account.
- Firestore: config sync, apps policy, commands, remote session, email blocklist check.
- Cloud Run: `getLatestGitHubRelease` for update checks.
- VPN2 WireGuard: reads `devices/{deviceId}.vpn` set by backend; see `vpn-wireguard`.

## Home tab
- Hi: uses Firebase display name or email prefix; includes Tech Take from `metadata/tech_take`.
- Policies at a glance: summary grouped by System/Installation/Network/Accessibility.
- Did you know: rotates hardcoded tips on resume.
- Policies applied counter: counts enabled policy chips.
- Managed apps overview: counts managed/total apps and restriction types.
- Whitelist summary: shows active domains; hides internal Firebase hosts.
- App update prompt: modal with Download/Remind/Never when a newer build is found.

## Onboarding
- Welcome + terms: must accept; links to privacy policy.
- Sign in: email + password + PIN, then device binding.
- Sign up: `isEmailAllowed` check, create user, write `users/{uid}` profile.
- Verify email: reloads user; blocks until verified.
- RegisterActivity: verified -> Auth/Main; unverified -> Verify.
- Password reset: sends Firebase reset email.
- Auth screens show a blocking loading overlay while network requests run.
- Device binding: RSA keypair + Functions `requestDeviceBinding`/`confirmDeviceBinding`.
- MDM PIN gate: validates `mdm_pin`/`mdm_pin_hash`; can trigger recovery.
- PIN recovery: `validateRecoveryPin` or email/password -> `ResetPinActivity`.
- Permissions check: device owner/admin + `WRITE_SECURE_SETTINGS`; applies defaults and sets `setup_complete=true`.
- Extra gates: Privacy tab re-checks storage/install packages/VPN consent; `bannedEmails` can trigger uninstall.

## System tab
- Disallow adding users: applies `UserManager.DISALLOW_ADD_USER`.
- Disable factory reset: applies `UserManager.DISALLOW_FACTORY_RESET` and `DISALLOW_SAFE_BOOT`.
- Block developer options: applies `UserManager.DISALLOW_DEBUGGING_FEATURES`.
- Disable app settings control: applies `UserManager.DISALLOW_APPS_CONTROL`.
- Block phone calls: applies `UserManager.DISALLOW_OUTGOING_CALLS`.
- Disable SMS/MMS: applies `UserManager.DISALLOW_SMS`.

## Installation
- Disable APK install: applies `UserManager.DISALLOW_INSTALL_APPS`.
- Block new apps: hides + suspends new installs unless approved; approvals from prefs, `ConfigStore`, and Firestore `devices/{deviceId}/apps/{package}`.
- Allow user updates: shows Updates link on the PIN screen to open the Updates tab (`UpdatesGuestActivity`).
- Block Play Store: hides `com.android.vending`.

## Network tab
- Disable tethering and hotspot: applies `UserManager.DISALLOW_CONFIG_TETHERING`.
- Block Wi-Fi: applies `UserManager.DISALLOW_CONFIG_WIFI` and stores `network.wifi_blocked`.
- Block all traffic: uses VPN firewall; forces Wi-Fi block while active.
- Enable private DNS: sets `private_dns_mode` + hostname; requires `WRITE_SECURE_SETTINGS`.
- Enable VPN firewall: starts `PcapVpnService`, sets Always-On, blocks VPN settings changes; per-app blocks use `firewall_rules`.
- Whitelist/Blacklist domains: handled inside `PcapVpnService` using `DomainFilter`; Private DNS can stay on.

## Accessibility tab
- Android Auto quirk: returns Home on Google Search/Maps accessibility events.
- Block WhatsApp updates tab: exits if the Updates tab is selected.
- Block WhatsApp channels: detects channel UI; applies penalty timers.
- Block status: detects Status UI; exits (penalty timers).
- Block AI chats: blocks Meta AI, Gemini chats, and Google Photos Create.
- Block all in-app browsers: on blocks all except exception list; off blocks only per-app blocklist.
- Block default browsers: hides/suspends browser-capable apps; blocks default-app changes on Android 14+.

## Apps tab
- Users apps: launchable apps with no managed flags.
- System apps: non-launchable apps with no managed flags.
- Managed apps: any app with active policy flags.
- Actions: hide, suspend, disable, make offline (VPN), block in-app browser, add WebView exception, block video, block uninstall.

## Updates tab
- Aurora updater: lists updates via Aurora GPlay API; pull to refresh, update all, swipe to mute; installs require device owner.

## Settings tab
- Switch to Hebrew: toggles app locale via AppCompatDelegate; stores `settings.language`.
- Export profile: writes encrypted ConfigStore export plus managed/approved app policies (no pins/auth/uid/email/snapshot).
- Import profile: applies entries + app policies; warns if VPN consent is missing.
- Import whitelist: edits domain whitelist; parses domain lists and saves `network.domain_whitelist_hosts`.
- Account info: shows signed-in email; copy to clipboard.
- Privacy policy: opens in-app WebView to GitHub `Privacy.md`.
- Check for app updates: queries latest release and triggers manual update check.
- Support us: opens `https://tripleu.org/support`.
- App density: applies app-only density scale and stores percent.
- Muted updates: list of muted packages; unmute in dialog.
- Reset MDM PIN: changes PIN and updates `auth.pin_sha256`.
- Uninstall: reverts policies, clears device owner, starts uninstall.
- Delete my account: calls Firebase `deleteAccount`, signs out.

## Invisible features

## Lifecycle + session
- App startup bootstrap: defers watchers/services until first resume.
- Boot behavior: restarts VPN/accessibility/app monitor after device boot.
- Session lock: auth resets immediately when app backgrounds.
- Lockout mode: kiosk-style lock driven by `system.lockout_enabled`.

## Identity + admin
- Device identity: generates `device-<uuid>` and centralizes Firestore paths.
- Device admin receiver selection: picks the active DeviceAdminReceiver (new vs legacy).
- Device info uploader (IMEI): uploads IMEI to `users/{uid}` when device owner + permission.
- Default policies (first-time setup): network reset block + FRP account + branding + self-block.

## Config + sync
- Config store (local SQLite): stores key/value config in `config.db` for sync.
- Cloud config sync: bi-directional sync between `ConfigStore` and Firestore.
- Config poller: applies config flags to policies, apps, network, and settings.
- Initial config snapshot: writes `snapshot.initial_payload` once after setup.

## App state sync
- App snapshot storage: mirrors per-app policy state to `devices/{deviceId}/apps/{package}`.
- App remote watcher: applies per-app policy changes and tracks portal-enforced hide/suspend lists.
- App inventory uploader: uploads installed app list + icons to Firestore.

## Network + VPN internals
- Host file auto-refresh: daily host file update job with progress notifications.
- VPN watchdog keepalive: pings DNS path and restarts VPN on timeout.
- Chrome SafeSearch enforcement: forces SafeSearch and disables Chrome DoH/QUIC.
- VPN2 WireGuard watcher: premium WireGuard + CA install + lockdown.
- Server stack details for VPN2/MITM: `vpn-wireguard`.

## Accessibility helpers
- Accessibility auto-enable: re-enables the accessibility service via Settings.Secure.
- Accessibility settings self-block: blocks disabling the accessibility service in Settings.
- Screen capture dialog auto-accept: auto-clicks MediaProjection consent.
- Gboard GIF search blocker: exits the GIF/search pane when enabled.
- Accessibility screenshot capturer: exists but unused.

## Remote control + reporting
- Remote command receiver: executes admin commands (lock/wipe/sync/uninstall/remote).
- Remote support: WebRTC screen share + remote input via accessibility.
- Report portal share: share a URL to open the local report portal.

## Updates + notifications
- Auto update checks: background APK checks and optional silent install.
- Aurora device spoofing: builds and caches Play profile for Aurora auth.
- Notification channels: defines service/update channel groups used by foreground services.

## Security
- Remote uninstall flag: Firestore `pendingUninstall` triggers uninstall flow.
- Blocked email uninstall: Firestore `bannedEmails/{email}` triggers uninstall flow.
