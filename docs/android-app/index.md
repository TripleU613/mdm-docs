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

Accessibility tab:
- Android Auto quirk: returns Home on Google Search/Maps accessibility events.
- Block WhatsApp updates tab: exits if the Updates tab is selected.
- Block WhatsApp channels: detects channel UI and applies penalty timers.
- Block status: detects Status UI and exits (penalty timers).
- Block AI chats: blocks Meta AI, Gemini chats, and Google Photos Create.
- Block all in-app browsers: WebView detection with blocklist/exception list.
- Block default browsers: hides/suspends browser-capable apps; blocks default-app changes on Android 14+.
