# Website

## Overview
- Next.js App Router.
- Main entry: `app/page.tsx` -> `app/components/dashboard/DashboardPage.tsx`.
- Login route: `app/login/page.tsx`.
- All data calls are client-side (Firestore/Directus/Cloud Run).

## Connections
- Android app applies config/app policies written here; see `android-app`.
- Full path map + backend details: `firestore-config`.
- VPN + MITM server stack: `vpn-wireguard`.
- Directus schema + ops: `directus`.

## Request map (website -> backend)
- Firebase Auth: login, session guard, sign out, password reset.
- Firestore: devices list, config state, apps, commands, notes, remote session.
- Cloud Run: device slot checkout and VPN checkout (ID token in Authorization header).
- Directus: VPN categories, appeals, category prefs, site overrides.
- WebRTC: STUN/TURN for Remote Control (TURN host on `kvylock`; see `vpn-wireguard`).

## Auth + access
- Login uses Firebase Auth email + password.
- Optional Cloudflare Turnstile if `NEXT_PUBLIC_CF_TURNSTILE_SITEKEY` is set.
- Turnstile token is checked client-side only.
- Login validates email format and password length (>= 6).
- Wrong-password/user-not-found/invalid-credential errors display "Wrong PIN."
- Dashboard redirects to `/login` when `onAuthStateChanged` reports no user.
- Sign out calls `signOut(auth)` and redirects to `/login`.

## Login page
### Where it lives
- `app/login/page.tsx`

### UI
- Email + password fields.
- "Continue" sign-in button.
- "Reset password" button.
- Optional Turnstile widget.

### Calls
- `signInWithEmailAndPassword(auth, email, password)`.
- `sendPasswordResetEmail(auth, email)`.

## Layout + navigation
- Header: `app/components/dashboard/HeaderBar.tsx`.
  - Device picker, Add device, Support, Contact, account menu (email + Sign out).
- Left nav: `app/components/dashboard/NavigationPanel.tsx`.
  - Tabs come from `app/components/dashboard/constants.ts` (`deviceTabs`).
- Save/Discard bar appears when config/app/device name/VPN category changes exist.
- Support opens `https://tripleu.org`.
- Contact opens `mailto:tripleuworld@gmail.com`.

## Global UI behavior
- Tabs are local state only (no URL per tab).
- Loading bar appears while auth/devices/config/apps/notes are loading.
- Toasts show bottom-center and auto-hide after ~4 seconds.
- Destructive actions use a confirm dialog (wipe/uninstall).

## Device list + selection (global)
### Where it lives
- `app/components/dashboard/DashboardPage.tsx`

### How it fetches
- Reads Firestore `devices` where `ownerUid == currentUser.uid`.
- If empty and `user.email` exists, falls back to `ownerEmail == user.email`.
- Limits to 25 devices.
- Auto-selects the first device in the list.

### Device metadata
- Reads `devices/{deviceId}` to build the header and status chips.
- `deviceName` edits are saved on "Save" (same commit as config/app changes).
- Label order: `deviceName` -> `displayName` -> `deviceInfo.model` -> `deviceId` -> doc id.

## Config + save flow (web)
### How it loads
- Reads `devices/{deviceId}/config/state/current/current`.
- Merges `entries[]` into `defaultDeviceConfig`.
- Missing config -> uses defaults.
- Ignores entries whose keys are not in `defaultDeviceConfig`.

### How it saves
- Saves device name to `devices/{deviceId}` when changed.
- Writes config `entries[]` back with `source=admin` and `updatedAtMs` (all keys).
- Preserves existing entries for unknown keys.
- Writes app changes in a Firestore batch.
- Saves VPN category changes (Directus) after Firestore writes.

### Discard
- Resets pending config/app changes, VPN category edits, and inputs.
- Increments `refreshTick` to refetch apps and notes.

## Firestore data model (fields used by UI)
### Device docs (`devices/{deviceId}`)
- `ownerUid`, `ownerEmail`.
- `deviceName` / `displayName`.
- `status`.
- `lastSeenMs` or `lastSeen`.
- `deviceInfo` (model, release/sdk, versionName, brand/manufacturer).
- `vpn` (used for VPN tab visibility): `active`, `stripeSubscriptionId`, `expiresAtMs`.

### Config doc (`devices/{deviceId}/config/state/current/current`)
- `entries[]`: `{ key, value, type, updatedAtMs, source }`.
- Meta: `cloudUpdated`, `cloudUpdatedTime`, `deviceUpdated`, `deviceUpdatedTime`, `updatedAtMs`, `lastSeenMs`, `status`.
- UI writes `entries` and sets `cloudUpdated=true` + `cloudUpdatedTime` on Save.
- Parsing rules in UI:
  - `settings.app_density_percent` -> int.
  - `settings.language`, `network.private_dns_hostname`, `auth.pin_sha256` -> string.
  - `network.domain_whitelist_hosts`, `updates.muted_packages` -> JSON string arrays.
  - Other keys -> boolean.
- On Save, `type` is `json` for whitelist/muted packages, `int` for density, `string` for text keys, `bool` for everything else.

### Apps (`devices/{deviceId}/apps`)
- `label`, `versionName`, `system`, `managed`.
- Policy flags: `approved`, `hidden`, `suspended`, `uninstallBlocked`, `networkBlocked`, `webviewBlocked`, `webviewException`, `videoBlocked`.
- `updatedAtMs`, `icon` (base64).
- App cards fall back to `https://play-lh.googleusercontent.com/<package>` when no icon.

### Notes (`devices/{deviceId}/notes`)
- `text`, `createdAt`.

### Commands (`devices/{deviceId}/commands`)
- Types used: `inventory`, `wipe`, `uninstall`, `start_remote`, `stop_remote`.

## Home tab
### Where it lives
- `app/components/dashboard/DashboardPage.tsx`
- `app/components/dashboard/constants.ts` (did-you-know tips)

### What it shows
- Device header (name, status, OS, app version, brand, owner email, last seen).
- Summary cards: Sync (cloud/device update times), Policies, Device state, Apps.
- App policy summary chips.
- "Did you know?" single tip (random on first load).
- Key restrictions list (up to 10 active policy keys).
- Notes list with add/delete and relative timestamps.
- Inline device name edit (Esc cancels, Enter/blur ends edit; Save persists).

### Data sources
- `devices/{deviceId}`: status, owner email, deviceInfo, deviceName.
- `devices/{deviceId}/config/state/current/current`: config entries + timestamps.
- `devices/{deviceId}/apps`: app flags for counts and policy summary.
- `devices/{deviceId}/notes`: note text + timestamps.

### Calls
- `getDocs(collection(db, "devices"))` for device list.
- `getDoc(doc(db, "devices", deviceId))` for device metadata.
- `getDoc(doc(db, "devices", deviceId, "config", "state", "current", "current"))` for config summary.
- `getDocs(collection(db, "devices", deviceId, "apps"))` for app counts.
- `addDoc` / `deleteDoc` in `devices/{deviceId}/notes` for notes.
- Notes query uses `orderBy("createdAt", "desc")` + `limit(50)`.

## System tab
### Where it lives
- `app/components/dashboard/DashboardPage.tsx`
- `app/components/dashboard/constants.ts`

### UI
- Remote Lockout Mode.
- Block Add Users.
- Block Factory Reset.
- Block Developer Options.
- Block Apps Control.
- Block Phone Calls.
- Block SMS.

### Config keys written
- `system.lockout_enabled`
- `system.add_users_blocked`
- `system.factory_reset_blocked`
- `system.developer_options_blocked`
- `system.apps_control_blocked`
- `system.calls_blocked`
- `system.sms_blocked`

### How it writes
- Switches update `pendingConfig`.
- "Save" writes to `devices/{deviceId}/config/state/current/current` as `entries[]` with `source=admin` and `updatedAtMs`.

### Calls
- No extra reads besides the shared config load.
- Uses `setDoc` to persist config entries on save.

## Installation tab
### Where it lives
- `app/components/dashboard/DashboardPage.tsx`
- `app/components/dashboard/constants.ts`

### UI
- Block APK installs.
- Block new apps.
- Block Play Store.
- Allow user updates.
- App Detection Console (Pending / Approved lists).

### Config keys written
- `system.apk_install_blocked`
- `apps.block_new_apps`
- `system.play_store_blocked`
- `apps.allow_user_updates`

### App approvals (console)
- Data source: `devices/{deviceId}/apps`.
- Pending list:
  - apps where `approved === false` (explicitly rejected), unless locally approved.
- Approved list:
  - apps where `approved === true`, or locally approved.
- Clicking Approve/Reject only updates local state until Save.
- On Save, each changed app writes:
  - `approved` boolean.
  - `hidden` and `suspended` set to `!approved`.
  - `updatedAtMs` and `source=admin`.
- App policy overrides from the Apps tab are applied after approvals.

### Calls
- Uses the shared config load.
- Uses `getDocs` on `devices/{deviceId}/apps` (already loaded for tabs).

## Remote Control tab
### Where it lives
- `app/components/dashboard/DashboardPage.tsx`
- `app/components/dashboard/RemoteControl.tsx`

### UI
- Start/Stop session buttons.
- Video stream area with mouse/touch control.
- Nav bar: Back, Home, Recents.
- Optional text input toggle.

### Firestore flow
- Start:
  - Writes `devices/{deviceId}/remote_session/current` with `status=idle` and `updatedAtMs`.
  - Adds `devices/{deviceId}/commands` with `type=start_remote`.
- Session:
  - Listens to `devices/{deviceId}/remote_session/current`.
  - When `status=offering`, reads `offer` and writes `answer`.
  - Ignores stale `status=ended` events where `updatedAtMs` is older than the session start.
- ICE:
  - Writes to `devices/{deviceId}/remote_session/current/remote_candidates`.
  - Listens to `devices/{deviceId}/remote_session/current/ice_candidates`.
- Stop:
  - Adds `devices/{deviceId}/commands` with `type=stop_remote`.
  - Writes `remote_session/current` with `status=ended`.

### WebRTC + input
- PeerConnection uses hardcoded STUN + TURN:
  - `stun:stun.l.google.com:19302`
  - `stun:159.65.173.60:3478`
  - `turn:159.65.173.60:3478` (username `tripleu`, credential `451341`) + TCP variant.
- Data channel messages:
  - `type: "input"` with `{ action, x, y }` (normalized 0..1).
  - `type: "nav"` with `{ action: "back" | "home" | "recents" }`.
  - `type: "text"` with `{ text }`.
  - `type: "key"` with `{ key }` or `{ action: "backspace" | "enter" | "tab" }`.
- Session stays alive across tab switches; cleanup only on Stop or page unload.
- Input behavior:
  - Click vs drag uses a 2% screen-distance threshold.
  - Mouse move events throttle to ~30fps.
  - Touch events map to the same `input` messages.
  - Pointer coordinates account for letterboxing (actual video display bounds).
- TURN server details: see `vpn-wireguard`.

## Accessibility tab
### Where it lives
- `app/components/dashboard/DashboardPage.tsx`
- `app/components/dashboard/constants.ts`

### UI
- Android Auto quirk.
- Block WhatsApp Updates tab.
- Block WhatsApp Channels.
- Block WhatsApp Status.
- Block In-App AI.
- Block All WebViews.
- Browser Dummy Mode.

### Config keys written
- `accessibility.android_auto_quirk`
- `accessibility.whatsapp_updates_blocked`
- `accessibility.whatsapp_channels_blocked`
- `accessibility.whatsapp_status_blocked`
- `accessibility.in_app_ai_blocked`
- `accessibility.webview_block_all`
- `accessibility.browser_dummy_mode`

### Calls
- Uses the shared config load + save flow.

## Network tab
### Where it lives
- `app/components/dashboard/DashboardPage.tsx`
- `app/components/dashboard/constants.ts`

### UI
- Enable VPN (master).
- Block All Traffic (disabled while whitelist is on).
- Block Wi-Fi.
- Block Tethering.
- Domain Whitelist Mode + host list editor.
- Private DNS + hostname (disabled while whitelist is on).

### Config keys written
- `network.vpn_enabled`
- `network.block_all_traffic`
- `network.wifi_blocked`
- `system.tethering_blocked`
- `network.domain_whitelist_enabled`
- `network.domain_whitelist_hosts` (JSON array)
- `network.private_dns_enabled`
- `network.private_dns_hostname`

### Calls
- Uses the shared config load + save flow.

## VPN tab (premium)
### Where it lives
- `app/components/dashboard/DashboardPage.tsx`
- Directus calls use `NEXT_PUBLIC_DIRECTUS_URL` (default `https://vpn.kvylock.com/directus`) and `NEXT_PUBLIC_DIRECTUS_TOKEN`.

### Tab visibility
- Only shows if `devices/{deviceId}.vpn` has:
  - `active=true`
  - `stripeSubscriptionId` not empty
  - `expiresAtMs` in the future

### Premium VPN toggle
- Writes config key `network.premium_vpn_enabled`.
- Disabled if the subscription check above fails.

### Flow
- Buy VPN -> Cloud Run checkout -> Stripe webhook -> Firebase writes `devices/{deviceId}.vpn`.
- Android reads the VPN fields and starts WireGuard; server stack is in `vpn-wireguard`.

### Appeals (blocked sites)
- Reads from Directus `vpn_appeals` filtered by `device_id`.
- Orders by `created_at` (desc) and only shows `pending` or empty status.
- Actions:
  - Allow site -> upsert `vpn_site_overrides` with `enabled_override=force_allow`.
  - Allow category -> upsert `vpn_category_prefs` with `enabled=true`.
  - Deny -> updates `vpn_appeals.status=denied`.

### Category defaults
- Reads categories from Directus `website_categories`.
- Reads and writes per-device overrides in `vpn_category_prefs`.
- Saves only the fields that differ from defaults.
- Category list rules:
  - Only `visibility=public|more`.
  - Excludes names in `EXTREME_CATEGORY_NAMES`.
  - Sorts by `sort_order`, then name.
  - `default_image_blocking` falls back to `default_gif_blocking` when present.
- Deletes a pref row when a category matches defaults.
### Directus details
- Schema and server notes: `directus`.

### Payments
- "Buy VPN" calls Cloud Run:
  - `https://createvpnsubscriptioncheckouthttp-xjmaoa4a5a-uc.a.run.app`
  - Authorization: Firebase ID token in `Authorization: Bearer <token>`.
  - Body: `{ deviceId }`.
  - Redirects to `url` from the response.

## Apps tab
### Where it lives
- `app/components/dashboard/DashboardPage.tsx`
- `app/components/dashboard/constants.ts`

### UI
- Search + filter (Managed/User/System/All).
- Inventory refresh button.
- Per-app policy chips: Hide, Suspend, Offline, Block Video, WebView block/exception, Lock Uninstall.

### App data source
- `devices/{deviceId}/apps` (limit 200, reused across tabs).

### App actions
- Inventory refresh sends command:
  - `devices/{deviceId}/commands` with `type=inventory`.
- Per-app changes are staged locally and written on Save.
- Writes per app:
  - `hidden`, `suspended`, `networkBlocked`, `videoBlocked`, `webviewBlocked`, `webviewException`, `uninstallBlocked`.
  - `updatedAtMs` and `source=admin`.
- When `accessibility.webview_block_all` is on:
  - The per-app WebView chip becomes an exception toggle.
- "Managed" filter is policy-based (hidden/suspended/network/webview/video/uninstall), not the Firestore `managed` flag.
- Search matches app label or package substring (case-insensitive).

## Settings tab
### Where it lives
- `app/components/dashboard/DashboardPage.tsx`
- `app/components/dashboard/utils.ts` (SHA-256)

### UI
- Language switch (English / Hebrew).
- Display density presets.
- Reset device PIN (hash stored in config).
- Muted app updates list.
- Account actions: Reset password, Factory reset, Uninstall MDM.
- Privacy policy link.

### Config keys written
- `settings.language`
- `settings.app_density_percent`
- `auth.pin_sha256` (SHA-256 of typed PIN)
- `updates.muted_packages` (JSON array)

### Commands + calls
- Reset password:
  - Reads `devices/{deviceId}.ownerEmail` and calls `sendPasswordResetEmail`.
- Factory reset:
  - Adds `devices/{deviceId}/commands` with `type=wipe`.
- Uninstall:
  - Adds `devices/{deviceId}/commands` with `type=uninstall`.
- Privacy policy opens `/privacy` in a new tab.
- Language values: `en` and `iw`.
- Density values: `0` (default), `20`, `25`, `50`, `75`, `100`.
- PIN input filters to digits and hashes once length >= 4 (no max enforced in UI).

## Payments (device slots)
- Header "Add device" calls Cloud Run:
  - `https://createdeviceslotcheckouthttp-xjmaoa4a5a-uc.a.run.app`
  - Authorization: Firebase ID token in `Authorization: Bearer <token>`.
  - Body: `{ quantity: 1 }`.
  - Redirects to `url` from the response.

## Environment vars
- `NEXT_PUBLIC_CF_TURNSTILE_SITEKEY` (optional): enables Turnstile on login.
- `NEXT_PUBLIC_CF_ANALYTICS_TOKEN` (optional): enables Cloudflare Insights beacon.
- `NEXT_PUBLIC_DIRECTUS_URL` (optional): Directus base URL (defaults to `https://vpn.kvylock.com/directus`).
- `NEXT_PUBLIC_DIRECTUS_TOKEN` (required for VPN tab): Directus API token.
- `NEXT_PUBLIC_SITE_URL` (optional): base URL for robots/sitemap.
- `VERCEL_URL` (fallback): used when `NEXT_PUBLIC_SITE_URL` is missing.

## Theme + global UI
- Theme provider: `app/providers.tsx` (MUI dark theme, Inter font, rounded corners).
- Global CSS: `app/globals.css` (dark background, border-box).

## Error + 404
- Global error page: `app/error.tsx` (Retry + Go home).
- Not found page: `app/not-found.tsx` (Go home + Reload).

## Build + deploy
- Next.js is configured for static export (`output: "export"` in `next.config.mjs`).
- Build output is `out/`.
- Next Image is unoptimized (`images.unoptimized=true`).
- `wrangler.jsonc` serves `./out` for Cloudflare Pages/Workers.
- Commands:
  - `npm run dev` (local)
  - `npm run build` (static export)

## Firebase client
- Config in `lib/firebase.ts` (hard-coded).
- `getFunctions(app, "us-central1")`.
- Analytics is client-only and guarded for SSR.
- Debug handle in browser: `window.__firebase = { app, db, functions, auth }`.

## Robots + sitemap
- `app/robots.ts` and `app/sitemap.ts` use `lib/siteMetadata.ts`.
- Routes included: `/` and `/login`.
- `sitemap.xml` uses `changeFrequency: weekly` with priority `1` for `/` and `0.7` for `/login`.
