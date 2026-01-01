import { defineConfig } from "vitepress";

export default defineConfig({
  title: "TripleUMDM Docs",
  description: "Internal system docs",
  themeConfig: {
    nav: [
      { text: "Home", link: "/" },
      { text: "Android MDM app", link: "/android-app/" },
      { text: "Website TS", link: "/website" },
      { text: "Firestore config DB", link: "/firestore-config" },
      { text: "VPN + MITM proxy", link: "/vpn-wireguard" },
      { text: "Directus DB", link: "/directus" },
    ],
    sidebar: {
      "/android-app/": [
        { text: "Overview", link: "/android-app/" },
        {
          text: "Onboarding",
          items: [
            { text: "Overview", link: "/android-app/onboarding/overview" },
            { text: "Welcome + terms", link: "/android-app/onboarding/welcome-and-terms" },
            { text: "Sign in", link: "/android-app/onboarding/sign-in" },
            { text: "Sign up", link: "/android-app/onboarding/sign-up" },
            { text: "Verify email", link: "/android-app/onboarding/verify-email" },
            { text: "Password reset", link: "/android-app/onboarding/password-reset" },
            { text: "Device binding", link: "/android-app/onboarding/device-binding" },
            { text: "MDM PIN gate", link: "/android-app/onboarding/mdm-pin" },
            { text: "PIN recovery", link: "/android-app/onboarding/recovery-pin" },
            { text: "Permissions check", link: "/android-app/onboarding/permissions-check" },
          ],
        },
        {
          text: "Home tab",
          items: [
            { text: "Hi <name>", link: "/android-app/home/hi" },
            {
              text: "Policies at a glance",
              link: "/android-app/home/policies-at-a-glance",
            },
            { text: "Did you know", link: "/android-app/home/did-you-know" },
            {
              text: "Policies applied counter",
              link: "/android-app/home/policies-applied-counter",
            },
            { text: "Managed apps overview", link: "/android-app/home/managed-apps-overview" },
            { text: "Whitelist summary card", link: "/android-app/home/whitelist-summary" },
            { text: "App update prompt", link: "/android-app/home/app-update-prompt" },
          ],
        },
        {
          text: "System tab",
          items: [
            {
              text: "Disallow adding users",
              link: "/android-app/system/disallow-adding-users",
            },
            {
              text: "Disable factory reset",
              link: "/android-app/system/disable-factory-reset",
            },
            {
              text: "Block developer options",
              link: "/android-app/system/block-developer-options",
            },
            {
              text: "Disable app settings control",
              link: "/android-app/system/disable-app-settings-control",
            },
            { text: "Block phone calls", link: "/android-app/system/block-phone-calls" },
            { text: "Disable SMS/MMS", link: "/android-app/system/disable-sms-mms" },
          ],
        },
        {
          text: "Installation",
          items: [
            {
              text: "Disable APK install",
              link: "/android-app/installation/disable-apk-install",
            },
            { text: "Block new apps", link: "/android-app/installation/block-new-apps" },
            {
              text: "Allow user updates",
              link: "/android-app/installation/allow-user-updates",
            },
            { text: "Block Play Store", link: "/android-app/installation/block-play-store" },
          ],
        },
        {
          text: "Accessibility",
          items: [
            { text: "Android Auto quirk", link: "/android-app/accessibility/android-auto-quirk" },
            {
              text: "Block WhatsApp updates tab",
              link: "/android-app/accessibility/block-whatsapp-updates-tab",
            },
            {
              text: "Block WhatsApp channels",
              link: "/android-app/accessibility/block-whatsapp-channels",
            },
            { text: "Block status", link: "/android-app/accessibility/block-status" },
            { text: "Block AI chats", link: "/android-app/accessibility/block-ai-chats" },
            {
              text: "Block all in-app browsers",
              link: "/android-app/accessibility/block-all-in-app-browsers",
            },
            {
              text: "Block default browsers",
              link: "/android-app/accessibility/block-default-browsers",
            },
          ],
        },
        {
          text: "Network tab",
          items: [
            {
              text: "Disable tethering and hotspot",
              link: "/android-app/network/disable-tethering-and-hotspot",
            },
            { text: "Block Wi-Fi", link: "/android-app/network/block-wi-fi" },
            { text: "Block all traffic", link: "/android-app/network/block-all-traffic" },
            { text: "Enable private DNS", link: "/android-app/network/enable-private-dns" },
            {
              text: "Enable VPN firewall (regular VPN, not VPN2)",
              link: "/android-app/network/enable-vpn-firewall",
            },
            {
              text: "Whitelist domains (regular VPN, not VPN2)",
              link: "/android-app/network/whitelist-domains",
            },
          ],
        },
        {
          text: "Updates tab",
          items: [{ text: "Aurora updater", link: "/android-app/updates/aurora-updater" }],
        },
        {
          text: "Apps tab",
          items: [
            {
              text: "App management tabs",
              items: [
                { text: "Users apps", link: "/android-app/apps/users-apps" },
                { text: "System apps", link: "/android-app/apps/system-apps" },
                { text: "Managed apps", link: "/android-app/apps/managed-apps" },
              ],
            },
            {
              text: "App actions",
              items: [
                { text: "Hide", link: "/android-app/apps/hide" },
                { text: "Make offline", link: "/android-app/apps/make-offline" },
                { text: "Make suspended", link: "/android-app/apps/make-suspended" },
                { text: "Disable", link: "/android-app/apps/disable" },
                { text: "Block video", link: "/android-app/apps/block-video" },
                {
                  text: "Block in-app browser",
                  link: "/android-app/apps/block-in-app-browser",
                },
                { text: "Block uninstall", link: "/android-app/apps/block-uninstall" },
                {
                  text: "Add WebView exception",
                  link: "/android-app/apps/add-webview-exception",
                },
              ],
            },
          ],
        },
        {
          text: "Settings tab",
          items: [
            { text: "Switch to Hebrew", link: "/android-app/settings/switch-to-hebrew" },
            { text: "Export profile", link: "/android-app/settings/export-profile" },
            { text: "Import profile", link: "/android-app/settings/import-profile" },
            { text: "Import whitelist", link: "/android-app/settings/import-whitelist" },
            { text: "Account info", link: "/android-app/settings/account-info" },
            { text: "Privacy policy", link: "/android-app/settings/privacy-policy" },
            {
              text: "Check for app updates",
              link: "/android-app/settings/check-for-app-updates",
            },
            { text: "Support us", link: "/android-app/settings/support-us" },
            { text: "App density", link: "/android-app/settings/app-density" },
            { text: "Muted updates", link: "/android-app/settings/muted-updates" },
            { text: "Reset MDM PIN", link: "/android-app/settings/reset-mdm-pin" },
            { text: "Uninstall", link: "/android-app/settings/uninstall" },
            { text: "Delete my account", link: "/android-app/settings/delete-my-account" },
          ],
        },
        {
          text: "Invisible features",
          items: [
            { text: "App startup bootstrap", link: "/android-app/invisible-features/app-startup" },
            { text: "Boot behavior", link: "/android-app/invisible-features/boot-behavior" },
            { text: "Device identity + Firestore paths", link: "/android-app/invisible-features/device-identity" },
            { text: "Device admin receiver selection", link: "/android-app/invisible-features/device-admin-provider" },
            { text: "Device info uploader (IMEI)", link: "/android-app/invisible-features/device-info-uploader" },
            { text: "Config store (local SQLite)", link: "/android-app/invisible-features/config-store" },
            { text: "Cloud config sync", link: "/android-app/invisible-features/cloud-sync" },
            { text: "Config poller", link: "/android-app/invisible-features/config-poller" },
            { text: "Default policies (first-time setup)", link: "/android-app/invisible-features/default-policies" },
            { text: "Initial config snapshot", link: "/android-app/invisible-features/config-snapshot" },
            { text: "App snapshot storage", link: "/android-app/invisible-features/app-snapshot-storage" },
            { text: "Host file auto-refresh", link: "/android-app/invisible-features/host-file-auto-refresh" },
            { text: "VPN watchdog keepalive", link: "/android-app/invisible-features/vpn-watchdog" },
            { text: "App remote watcher", link: "/android-app/invisible-features/app-remote-watcher" },
            { text: "App inventory uploader", link: "/android-app/invisible-features/app-inventory-uploader" },
            { text: "Auto update checks", link: "/android-app/invisible-features/auto-update-checks" },
            { text: "Aurora device spoofing", link: "/android-app/invisible-features/aurora-device-spoofing" },
            { text: "Chrome SafeSearch enforcement", link: "/android-app/invisible-features/chrome-safe-search" },
            { text: "Accessibility auto-enable", link: "/android-app/invisible-features/accessibility-auto-enable" },
            { text: "Notification channels", link: "/android-app/invisible-features/notification-channels" },
            { text: "Accessibility settings self-block", link: "/android-app/invisible-features/accessibility-self-block" },
            { text: "Screen capture dialog auto-accept", link: "/android-app/invisible-features/screen-capture-auto-accept" },
            { text: "Gboard GIF search blocker", link: "/android-app/invisible-features/gboard-gif-blocker" },
            { text: "Remote command receiver", link: "/android-app/invisible-features/command-receiver" },
            { text: "Remote support", link: "/android-app/invisible-features/remote-support" },
            { text: "Accessibility screenshot capturer (unused)", link: "/android-app/invisible-features/accessibility-screenshot-capturer" },
            { text: "Report portal share", link: "/android-app/invisible-features/report-portal-share" },
            { text: "Session lock", link: "/android-app/invisible-features/session-lock" },
            { text: "Lockout mode", link: "/android-app/invisible-features/lockout-mode" },
            { text: "Remote uninstall flag", link: "/android-app/invisible-features/remote-uninstall-flag" },
            { text: "Blocked email uninstall", link: "/android-app/invisible-features/blocked-email-uninstall" },
            { text: "VPN2 WireGuard watcher", link: "/android-app/invisible-features/vpn2-wireguard" },
            { text: "Play Integrity checks", link: "/android-app/invisible-features/play-integrity" },
          ],
        },
      ],
      "/": [
        { text: "Home", link: "/" },
        { text: "Android app", link: "/android-app/" },
        { text: "Website", link: "/website" },
        { text: "Firestore config", link: "/firestore-config" },
        { text: "VPN + MITM proxy", link: "/vpn-wireguard" },
        { text: "Directus", link: "/directus" },
      ],
    },
  },
});
