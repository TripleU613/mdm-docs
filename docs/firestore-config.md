# Firebase backend + clients

## Connections
- Android app: device binding, config sync, inventory. See `android-app`.
- Website: admin UI for config/apps/commands. See `website`.
- VPN + MITM server stack: `vpn-wireguard`.
- Directus schema + ops: `directus`.

## Backend: Cloud Functions (Firebase)
### Global settings
- Region: `us-central1`.
- Timeout: 60s.
- Memory: 256MiB.
- CORS allowlist: `http://localhost:3000`, `https://tripleumdm.com`, `https://www.tripleumdm.com`.

### Environment variables used
- `DEVICE_ADMIN_SECRET`
- `STRIPE_SECRET_KEY`
- `STRIPE_PRICE_DEVICE_SLOT`
- `STRIPE_SUCCESS_URL`
- `STRIPE_CANCEL_URL`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PRICE_VPN`
- `STRIPE_VPN_WEBHOOK_SECRET`
- `VPN_API_URL`
- `VPN_API_KEY`
- `WG_ENDPOINT`
- `WG_PUBLIC_KEY_MITM`
- `WG_PUBLIC_KEY_CLEAN`
- `WG_PUBLIC_KEY_BLOCK`
- `DIRECTUS_URL`
- `DIRECTUS_TOKEN`
- `DIRECTUS_ADMIN_EMAIL`
- `DIRECTUS_ADMIN_PASSWORD`
- `TURN_HOST`
- `TURN_URLS` / `TURN_URL`
- `TURN_USERNAME` / `TURN_USER`
- `TURN_CREDENTIAL` / `TURN_PIN`
- `APP_PACKAGE_NAME`
- `GITHUB_TOKEN`

### Callable functions (onCall)
- `remoteStart`: input `deviceId`; writes `remote_session/current`, clears `ice_candidates`, enqueues `start_remote`; returns `commandId` + TURN config.
- `remoteStop`: input `deviceId`; enqueues `stop_remote`, sets session status `ended`; returns `commandId`.
- `remoteStatus`: input `deviceId`; returns session doc + TURN config.
- `requestPinReset`: input `email` (optional when signed in); writes `pinResets/{uid}` and a `mail` doc.
- `confirmPinReset`: input `code`; verifies `pinResets/{uid}` then deletes it.
- `requestUninstall`: input `email` (optional when signed in); writes `uninstallTokens/{uid}` and a `mail` doc.
- `confirmUninstall`: input `code`; sets `users/{uid}.pendingUninstall = true` and deletes token.
- `validateRecoveryPin`: input `deviceId`, `enteredPin`; checks `online_pin/current` + device install timestamp.
- `deleteAccount`: deletes user docs + auth user; writes `bannedEmails/{email}`.
- `isEmailAllowed`: input `email`; checks `bannedEmails/{email}`.
- `requestDeviceBinding`: input `publicKey`, optional `deviceInfo` + `deviceId`; creates/updates `devices/{deviceId}` pending challenge; updates `users/{uid}`; returns `{ deviceId, challenge }`.
- `confirmDeviceBinding`: input `deviceId`, `signature`; verifies RSA challenge, activates device + updates user doc.
- `requestDeviceChallenge`: input `deviceId`; writes new challenge on device.
- `verifyDeviceChallenge`: input `deviceId`, `signature`; verifies challenge, updates device + user doc.
- `setDeviceAllowance`: requires admin secret; input `email`, `allowance`; updates `users/{uid}.deviceAllowance`.
- `verifyIntegrityToken`: input `token`; calls Play Integrity API; returns verdicts.
- `createDeviceSlotCheckout`: Stripe one-time checkout; input `quantity`; returns `url`.
- `cancelVpnSubscription`: input `deviceId`, optional `subscriptionId`, `cancelNow`; updates Stripe + `devices/{deviceId}.vpn`.
- `listWebsiteCategories`: returns Directus `website_categories`.
- `updateWebsiteCategory`: patches Directus `website_categories/{id}` defaults.
- `listWebsiteAppeals`: returns pending Directus `website_appeals`.
- `resolveWebsiteAppeal`: approves/denies Directus appeal and upserts `websites`.

### HTTP functions (onRequest)
- `provisionNewDevice` (POST): input `deviceModel`; creates a new `devices` doc; returns `deviceId`.
- `techTakeManual`: requires `x-tech-take-secret`; refreshes `metadata/tech_take`.
- `getLatestGitHubRelease`: input `repoOwner`, `repoName`; returns tag, parsed `versionCode`, assets.
- `stripeDeviceSlotWebhook`: Stripe checkout webhook; increments `users/{uid}.deviceAllowance`.
- `stripeVpnWebhook`: Stripe subscription webhooks; grants/revokes `devices/{deviceId}.vpn` and WireGuard.
- `createDeviceSlotCheckoutHttp`: requires bearer ID token; input `quantity`; returns `url`.
- `createVpnSubscriptionCheckoutHttp`: requires bearer ID token; input `deviceId`; verifies ownership; returns `url`.

### Scheduled functions
- `techTakeCron`: daily 02:05 UTC; refreshes `metadata/tech_take`.

### Firestore triggers
- `onConfigWrite`: `devices/{deviceId}/config/state/current/current`; clears `deviceUpdated` when acknowledged.
- `onLegacyConfigWrite`: same logic under `users/{uid}/devices/{deviceId}`.
- `onDeviceWrite`: `devices/{deviceId}`; manages WireGuard address/endpoint/keys and calls VPN API.

### External dependencies
- Stripe (device slots + VPN subscriptions).
- Directus (VPN categories, appeals, site overrides).
- VPN API (WireGuard peer upsert/remove) hosted on `kvylock`; see `vpn-wireguard`.
- Play Integrity API (token verification).
- Gemini API (tech take content).
- GitHub API (latest release lookup).

### Deployed functions (gcloud list)
- region: `us-central1`.
- runtimes: `nodejs20` (most), `nodejs22` (email extension worker).
- names:
  - requestDeviceBinding
  - confirmDeviceBinding
  - requestDeviceChallenge
  - verifyDeviceChallenge
  - remoteStart
  - remoteStop
  - remoteStatus
  - requestPinReset
  - confirmPinReset
  - requestUninstall
  - confirmUninstall
  - validateRecoveryPin
  - verifyIntegrityToken
  - deleteAccount
  - isEmailAllowed
  - setDeviceAllowance
  - provisionNewDevice
  - getLatestGitHubRelease
  - techTakeManual
  - techTakeCron
  - createDeviceSlotCheckout
  - createDeviceSlotCheckoutHttp
  - stripeDeviceSlotWebhook
  - createVpnSubscriptionCheckoutHttp
  - cancelVpnSubscription
  - stripeVpnWebhook
  - listWebsiteCategories
  - updateWebsiteCategory
  - listWebsiteAppeals
  - resolveWebsiteAppeal
  - onConfigWrite (Firestore trigger)
  - onLegacyConfigWrite (Firestore trigger)
  - onDeviceWrite (Firestore trigger)
  - ext-firestore-send-email-processqueue (Firestore trigger on `mail/{documentId}`)

### Backend Firestore collections (touched by functions)
- `users/{uid}`: `deviceAllowance`, `activeDeviceId`, `activeDevices`, `deviceStatus`, `pendingUninstall`, `stripeCustomerId`, `stripeLastCheckoutId`, `stripeUpdatedAt`, `lastDeviceCheck`.
- `pinResets/{uid}`: `hash`, `salt`, `expiresAt`.
- `uninstallTokens/{uid}`: `hash`, `salt`, `expiresAt`.
- `bannedEmails/{email}`: `reason`, `bannedAt`.
- `mail/{docId}`: email payloads for the mail extension.
- `metadata/tech_take`: `date`, `english`, `hebrew`, `lastUpdatedAt`.
- `config/turn`: TURN urls + credentials (server details in `vpn-wireguard`).
- `config/wg`: endpoint + public keys.
- `config/wg_pool`: next host counters.
- `online_pin/current`: `pinValue`.
- `devices/{deviceId}` + subcollections (commands, apps, remote_session).

## Backend: Firestore rules (current file)
- `users/{uid}` is owner-only.
- `devices/{deviceId}` and subcollections are open (`allow read, write: if true`).
- `pinResets`, `uninstallTokens`, `mail` are server-only (no client read/write).
- `metadata/tech_take` is readable only for signed-in users.
- `config/turn` is public read; all other config docs are write-denied.

## Backend: Firestore database
- Type: Firestore Native.
- Location: `nam5`.
- App Engine integration: disabled.
- Delete protection: disabled.

## Backend: Storage rules
- All reads/writes are denied.

## Backend: Remote Config
- Template is empty (`{}`).

## Backend: Realtime Database
- `blockedEmails`: list of email strings. Read by Android on startup to force uninstall. No writers in this repo.

## Backend: Admin scripts (local)
- `functions/check_commands.js`: list latest commands for a device.
- `functions/check_session.js`: read `remote_session/current` for a device by owner email.
- `functions/cleanup_fake_apps.js`, `functions/cleanup_old_device.js`: delete hard-coded fake apps from a device.
- `functions/find_device.js`: lookup by deviceId, ownerEmail, or ownerUid.
- `functions/find_tripleu_devices.js`: list devices for a hard-coded owner email.
- `functions/inspect_device.js`: print a device doc.
- `functions/inspect_fb.js`: inspect a single app doc on a device.
- `functions/list_recent_devices.js`: list recent devices by `lastSeenMs`.
- `functions/seed_data.js`, `functions/seed_target.js`, `functions/seed_target_tripleu.js`: seed test configs + apps.
- `functions/start_remote_test.js`, `functions/start_remote_pox.js`: enqueue `start_remote`.
- `functions/transfer_device.js`: move device to a target owner email.
- `functions/wipe_device.js`: enqueue `wipe`.
- All scripts use a service account key and hard-coded targets; edit before use.

## Website usage
### Services in use
- Firebase Auth (email + password).
- Firestore (config, inventory, commands, remote session).
- Firebase Functions SDK is initialized in `lib/firebase.ts` (region us-central1) but not called in the website UI.
- Firebase Analytics is initialized client-side only (no custom events in this repo).
- Realtime Database and Storage are configured in the client config but not used in the website UI.

### Firebase SDK calls in the website
#### firebase/app
- initializeApp
- getApp
- getApps

#### firebase/auth
- getAuth
- onAuthStateChanged
- signInWithEmailAndPassword
- signOut
- sendPasswordResetEmail

#### firebase/firestore
- getFirestore
- collection
- doc
- query
- where
- limit
- orderBy
- getDoc
- getDocs
- setDoc
- updateDoc
- addDoc
- deleteDoc
- writeBatch
- onSnapshot

#### firebase/functions
- getFunctions (initialized only)

#### firebase/analytics
- getAnalytics (client-side guarded; returns null on SSR)

### Auth flows (website)
- Login: `signInWithEmailAndPassword` in `app/login/page.tsx`.
- Auth guard: `onAuthStateChanged` in `app/components/dashboard/DashboardPage.tsx`.
- Sign out: `signOut` in `app/components/dashboard/DashboardPage.tsx`.
- Password reset:
  - From login page: `sendPasswordResetEmail` uses the entered email.
  - From Settings tab: reads `devices/{deviceId}.ownerEmail` and sends reset.

### Firestore data model used by the website
#### devices (collection)
Fields read:
- ownerUid, ownerEmail
- deviceName, displayName
- status, lastSeen, lastSeenMs
- deviceInfo (model, release or sdk, versionName, brand or manufacturer)
- vpn: active, stripeSubscriptionId, expiresAtMs

Writes:
- deviceName (on Save)

Queries:
- where ownerUid == auth.uid (limit 25)
- fallback where ownerEmail == user.email (limit 25)

#### `devices/{deviceId}/config/state/current/current` (doc)
Fields read:
- entries[]: `{ key, value, type, updatedAtMs, source }`
- cloudUpdated, cloudUpdatedTime, deviceUpdated, deviceUpdatedTime, updatedAtMs, lastSeenMs, status

Fields written (on Save):
- entries[] merged with existing entries
- cloudUpdated = true, cloudUpdatedTime = now, updatedAtMs = now

Config keys (from `app/components/dashboard/constants.ts`):
- apps.block_new_apps
- apps.allow_user_updates
- system.apk_install_blocked
- system.play_store_blocked
- accessibility.android_auto_quirk
- accessibility.whatsapp_updates_blocked
- accessibility.whatsapp_channels_blocked
- accessibility.whatsapp_status_blocked
- accessibility.in_app_ai_blocked
- accessibility.block_webview
- accessibility.webview_block_all
- accessibility.browser_dummy_mode
- system.add_users_blocked
- system.factory_reset_blocked
- system.developer_options_blocked
- system.apps_control_blocked
- system.calls_blocked
- system.sms_blocked
- system.tethering_blocked
- system.lockout_enabled
- network.vpn_enabled
- network.premium_vpn_enabled
- network.block_all_traffic
- network.wifi_blocked
- network.domain_whitelist_enabled
- network.domain_whitelist_hosts (JSON string)
- network.private_dns_enabled
- network.private_dns_hostname
- settings.language
- settings.app_density_percent
- auth.pin_sha256
- updates.muted_packages (JSON string)

Type handling (UI):
- settings.app_density_percent -> int
- settings.language, network.private_dns_hostname, auth.pin_sha256 -> string
- network.domain_whitelist_hosts, updates.muted_packages -> JSON string arrays
- all other keys -> boolean

#### `devices/{deviceId}/apps` (collection)
Fields read:
- label, versionName, system, managed
- approved, hidden, suspended, uninstallBlocked, networkBlocked, webviewBlocked, webviewException, videoBlocked
- updatedAtMs, updatedAt, icon (base64)

Writes:
- approved, hidden, suspended (from Installation tab approvals)
- policy toggles from Apps tab
- updatedAtMs, source=admin

Queries:
- limit 200

#### `devices/{deviceId}/notes` (collection)
Fields read:
- text, createdAt

Writes:
- addDoc `{ text, createdAt }`
- deleteDoc note

Queries:
- orderBy createdAt desc, limit 50

#### `devices/{deviceId}/commands` (collection)
Writes:
- addDoc `{ type, status=pending, createdAtMs, payload }`
Types used by the website:
- inventory
- wipe
- uninstall
- start_remote
- stop_remote

#### `devices/{deviceId}/remote_session/current` (doc)
Reads:
- status, updatedAtMs, offer, answer, reason

Writes:
- set status idle on start
- update answer + status answering
- set status ended on stop

Listeners:
- onSnapshot on the doc while Remote Control is active

#### `devices/{deviceId}/remote_session/current/ice_candidates` (collection)
Reads:
- onSnapshot for device ICE candidates

#### `devices/{deviceId}/remote_session/current/remote_candidates` (collection)
Writes:
- addDoc of browser ICE candidates

### Timestamp handling (website)
- Accepts Firestore Timestamp objects (`toMillis`) and raw `_seconds` objects.
- Falls back to `null` when no timestamp is present.

### Website-only Firebase tokens
- `auth.currentUser.getIdToken()` is used to call Cloud Run checkout endpoints.

## Android app usage
### Firebase Auth
- Email/password sign-in + sign-up.
- Anonymous sign-in only for recovery PIN validation.

### Firebase Functions called by Android
- `requestDeviceBinding`, `confirmDeviceBinding`, `requestDeviceChallenge`, `verifyDeviceChallenge`.
- `isEmailAllowed`.
- `validateRecoveryPin`.
- `deleteAccount`.
- `verifyIntegrityToken`.

### HTTP endpoints used by Android (Cloud Run)
- `getLatestGitHubRelease`: POST `https://getlatestgithubrelease-xjmaoa4a5a-uc.a.run.app` with `{"data":{"repoOwner":"TripleU613","repoName":"TripleUMDM_Public"}}`.

### Firestore paths used by Android
- `devices/{deviceId}`: writes `status`, `lastSeenMs`, `deviceInfo`, `deviceId`; writes `vpn.wgPublicKey`; reads `vpn.*`.
- `devices/{deviceId}/config/state/current/current`: reads/writes `entries[]` + sync flags; writes `deviceInfo`, `lastSeenMs`, `deviceId`.
- `devices/{deviceId}/apps/{package}`: inventory + policy flags (`approved`, `hidden`, `suspended`, `uninstallBlocked`, `networkBlocked`, `webviewBlocked`, `webviewException`, `videoBlocked`, `managed`, `installed`, `icon`).
- `devices/{deviceId}/commands/{cmdId}`: reads commands; writes `status` + `updatedAtMs`; writes `commands/{cmdId}/audit`.
- `devices/{deviceId}/remote_session/current` + `ice_candidates` + `remote_candidates`: WebRTC signaling for remote control.
- `users/{uid}`: writes profile on sign-up + IMEI updates; reads `pendingUninstall` and `activeDeviceId`.
- `metadata/tech_take`: read for Home "Tech Take of the Day".

### Realtime Database (Android only)
- `blockedEmails`: read-only list of blocked emails; if current email is present, app clears device owner and starts uninstall.

## Firestore path map (all readers/writers)
- `devices/{deviceId}`: writes from Cloud Functions (device binding + VPN status) and Android (markDeviceAlive, VPN2 wgPublicKey); reads by website, Android (VPN2), and `onDeviceWrite`. Key fields used: `ownerUid`, `ownerEmail`, `publicKey`, `status`, `pendingChallenge`, `challengeCreatedAt`, `lastVerifiedAt`, `lastSeen`, `lastSeenMs`, `deviceInfo`, `deviceId`, `deviceName`, `displayName`, `installTimestamp`, `dateInstalled`, `vpn.*`.
- `devices/{deviceId}/config/state/current/current`: writes from Android (CloudSyncManager) and website; `onConfigWrite` clears `deviceUpdated` when device is newer. Fields: `entries[]`, `cloudUpdated`, `cloudUpdatedTime`, `deviceUpdated`, `deviceUpdatedTime`, `updatedAtMs`, `lastSeenMs`, `status`, `deviceInfo`, `deviceId`, `source`.
- `users/{uid}/devices/{deviceId}/config/state/current/current`: legacy path; only `onLegacyConfigWrite` listens (no writes in current Android app).
- `devices/{deviceId}/apps/{package}`: writes from Android (inventory + new-app detection + snapshot) and website (policy toggles); reads by Android `AppRemoteWatcher` and website apps UI.
- `devices/{deviceId}/commands/{cmdId}`: writes from website, Cloud Functions `remoteStart/remoteStop`, and admin scripts; reads by Android `CommandReceiver`. Subcollection `commands/{cmdId}/audit` is written by Android.
- `devices/{deviceId}/remote_session/current`: writes from Android (offer/status), website (answer/status), and Cloud Functions (start/stop); read by Android + website. Subcollections: `ice_candidates` (device -> web) and `remote_candidates` (web -> device).
- `devices/{deviceId}/notes/{noteId}`: website only.
- `users/{uid}`: writes from Android sign-up + IMEI updates and Cloud Functions (device allowance, device binding status, pending uninstall, Stripe); reads by Android (pendingUninstall, activeDeviceId) and Cloud Functions.
- `pinResets/{uid}` + `uninstallTokens/{uid}`: Cloud Functions only.
- `bannedEmails/{email}`: Cloud Functions only; used by `isEmailAllowed` + `deleteAccount`.
- `mail/{docId}`: Cloud Functions writes; mail extension consumes.
- `metadata/tech_take`: Cloud Functions write; Android reads.
- `config/turn`: Cloud Functions read; TURN config for remote control.
- `config/wg`: Cloud Functions read; WireGuard endpoint/public keys.
- `config/wg_pool`: Cloud Functions read/write; next host counters for WG.
- `online_pin/current`: Cloud Functions read; rotating PIN for recovery.

## Cross-system map (Android, Website, Firebase)
- Device binding: Android `DeviceBindingManager` calls `requestDeviceBinding`/`confirmDeviceBinding`; Firebase writes `devices/{deviceId}` + `users/{uid}`; website reads device list from `devices`.
- Device slots: website `DashboardPage` calls `createDeviceSlotCheckoutHttp`; Firebase `stripeDeviceSlotWebhook` updates `users/{uid}.deviceAllowance`; Android binding enforces allowance.
- Policy sync: website `DashboardPage` writes `entries[]` + `cloudUpdated`; Android `CloudSyncManager` pulls/applies; Firebase `onConfigWrite` clears `deviceUpdated`.
- App approvals: Android `NewAppDetectorWorker` + `AppInventoryUploader` write apps with `approved=false`; website Installation/Apps toggles; Android `AppRemoteWatcher` applies.
- Remote control: website `RemoteControl.tsx` writes `start_remote` + `remote_session`; Android `CommandReceiver` + `RemoteStreamManager` stream/answer; Firebase functions `remoteStart`/`remoteStop` are optional helpers.
- VPN firewall + whitelist: website toggles `network.*` + per-app `networkBlocked`; Android `ConfigPoller` + `AdVpnService`/`WhitelistVpnService`; Firebase config doc + apps docs.
- VPN2 WireGuard: website VPN tab starts checkout + edits Directus categories; Firebase writes `devices/{deviceId}.vpn` and `onDeviceWrite` provisions WG; Android `Vpn2RemoteWatcher` uploads `vpn.wgPublicKey` and starts WireGuard.
- PIN recovery + uninstall: Android `AuthActivity` calls `validateRecoveryPin`, `MainActivity` watches `users/{uid}.pendingUninstall`; Firebase functions handle reset/uninstall tokens; website does not call these.
- Tech take: Firebase `techTakeCron` writes `metadata/tech_take`; Android `TechTakeRepository` reads; website does not use it.
- App updates: Android `AppReleaseChecker` calls `getLatestGitHubRelease` Cloud Run; website does not use it.
- Blocked emails: Firebase Realtime DB `blockedEmails` is read by Android `MainActivity`; website does not use it.
- Server stack details for VPN/MITM/Directus: `vpn-wireguard` and `directus`.
