# Accessibility Tab

The **Accessibility** tab contains multiple behavior-based and overlay-driven controls.  
Each switch targets specific in-app features and prevents access by detecting UI elements and immediately exiting the screen when triggered.

<details>
<summary>image</summary>

![Accessibility tab showing content and app behavior restriction switches](/assets/accessibility-tab.png){ width=320 }

</details>

---

## Android Auto Port

Controls which Android Auto features are allowed.

Available modes:

- **Block All**
- **Maps Only**
- **Google Only**

When enabled:

- Google Maps and the Google quick search box are **not disabled**
- Instead, restricted screens immediately **exit ("jump out")** when detected
- This approach ensures Android Auto itself is not disrupted

<details>
<summary>image</summary>

![Android Auto selector](/assets/android-auto-selector.png){ width=320 }

</details>

---

## WhatsApp Restrictions

These switches apply overlays and exit behavior when restricted content is detected.

### Block WhatsApp Updates Tab
- Blocks access to the **Updates** tab
- Immediately exits the screen when opened

### Block WhatsApp Channels
- Blocks WhatsApp **Channels**
- Applies an overlay and exits when detected

### Block WhatsApp Status
- Blocks the **Status** feature
- Applies an overlay and exits when detected

---

## Play Store Restrictions

### Block Play Store Books Tab
Blocks access to the **Books** tab inside Google Play Store.

- Uses an overlay on the Books tab
- Intended for use when:
  - The Play Store must remain accessible
  - A **Premium VPN** is enabled

> More details on VPN behavior are covered later.

---

## In-App AI Restrictions

### Block In-App AI Chats
Prevents access to AI features embedded inside apps.

Currently blocks:

- **Meta AI** in WhatsApp
- **Gemini** in Google Messages
- **Create** tab in Google Photos

When detected, the app immediately exits the restricted screen.

---

## In-App Browser Controls

### Block All In-App Browsers
Controls detection of embedded in-app browsers.

Behavior when enabled:

- All in-app browsers are blocked by default
- You can add **exceptions** in the **Apps Management** tab

Behavior when disabled:

- No in-app browsers are blocked by default
- You must explicitly enable detection for individual apps in **Apps Management**

This switch functions as:

- **Enabled** → Block all, allow exceptions  
- **Disabled** → Allow all, block only specified apps

<details>
<summary>image</summary>

![App management with Block All In-App Browsers OFF](/assets/inapp-browsers-off.png){ width=320 }

</details>
<details>
<summary>image</summary>

![App management with Block All In-App Browsers ON](/assets/inapp-browsers-on.png){ width=320 }

</details>

---

## Telegram Filtering

Telegram filtering is feature-based and not fully reliable.  
Use with caution.

Recommended configuration: **Enable all Telegram filters**.

Available Telegram filters:

- Block Telegram search
- Block Telegram groups
- Block Telegram channels
- Block Telegram bots
- Block Telegram in-app browser  
  - Includes a **10-minute suspension**
- Block Telegram GIFs and stickers
- Block Telegram profiles

<details>
<summary>image</summary>

![Telegram sub-switches](/assets/telegram-filters.png){ width=320 }

</details>

> ⚠️ **Important:**  
> Telegram UI detection is inconsistent across versions.  
> These controls may not work reliably on all devices or app updates.

---

## Summary

- Accessibility policies rely on **UI detection and overlays**
- Restricted content causes the app to immediately exit the screen
- Some features (notably Telegram) may behave inconsistently
- Use exception-based controls where reliability is critical