# Apps Tab

The **Apps** tab is the main **application management terminal**.  
It provides visibility and control over all apps on the device and allows policies to be applied at the individual app level.

<details>
<summary>Image</summary>

![Apps tab showing User, System, and Managed sub-tabs](/assets/apps-tab.png){ width=320 }

</details>

---

## App Categories

The Apps tab is divided into three sub-tabs:

### User
Displays all **launchable applications**.

- Not limited to apps installed by the end user
- Includes any app with a launchable activity
- Represents what the user can actually open on the device

---

### System
Displays **non-launchable system applications**.

- Apps without a launch intent
- Useful for identifying:
  - Core system components
  - Non-essential system services

This view helps distinguish critical system apps from optional ones.

---

### Managed
Displays apps that currently have **MDM policies applied**.

- Any app you configure through app-level controls appears here
- Useful for auditing and reviewing applied restrictions

<details>
<summary>Image</summary>

![Managed tab at a glance](/assets/managed-tab.png){ width=320 }

</details>

---

## App Actions

When you **tap an app** or **long-press to multi-select**, a set of action chips appears.

> Available actions may vary depending on enabled MDM features (for example, VPN-related controls).

<details>
<summary>Image</summary>

![Multi-select actions](/assets/apps-multiselect.png){ width=320 }

</details>
<details>
<summary>Image</summary>

![App actions list](/assets/app-actions.png){ width=320 }

</details>

---

### Core App Actions

These actions are always available:

#### Hide / Unhide
- **Hide**:
  - Removes the app from the launcher
  - Also disables the app
- Tapping again switches the action to **Unhide**

---

#### Suspend / Unsuspend
- Suspends the app using a system flag
- Generally less useful than Hide
- Can be reversed with **Unsuspend**

---

#### Uninstall / Reinstall
- **User apps**:
  - Fully uninstalled from the device
- **System apps**:
  - Uninstalled for the current user only

Reinstall behavior:
- User apps can be reinstalled normally
- System apps are restored as existing system components

This option is primarily intended for **remote uninstall scenarios**, but is also available locally.

---

### Network and VPN Actions

These actions appear when relevant network features are enabled.

#### Block Network / Unblock Network
- Available when **Legacy VPN (PCAP-based)** is active
- Prevents the selected app from accessing the network

---

#### Include in VPN / Exclude from VPN
Controls VPN routing for individual apps.

- Behavior depends on whether VPN is in:
  - **Include mode**
  - **Exclude mode**

These actions allow per-app VPN exceptions.

---

### In-App Browser Controls

#### Block In-App Browser / Allow In-App Browser
- Blocks embedded web views inside the app
- Can be toggled per app

#### Set WebView Exception
- Exempts the app from in-app browser detection
- Useful when global in-app browser blocking is enabled

These options work together with the **Accessibility → In-App Browser** settings.

---

### Uninstall Protection

#### Block Uninstall / Allow Uninstall
- Prevents the selected app from being uninstalled
- Applies only to the specific app
- Can be toggled on or off

> This is independent of the **Disable App Settings Control** option in the System tab.

---

## Summary

- **User** tab shows all launchable apps
- **System** tab shows non-launchable system components
- **Managed** tab shows apps with active MDM policies
- App actions are context-aware and may change based on enabled features
- Most controls are reversible via toggle-style actions

The Apps tab is the central location for fine-grained, per-app policy enforcement.