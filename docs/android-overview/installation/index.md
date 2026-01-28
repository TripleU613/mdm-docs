# Installation Tab

The **Installation** tab controls how applications can be installed, updated, and accessed on the device.

<details>
<summary>Image</summary>

![Installation tab showing app installation policy switches](/assets/installation-tab.png){ width=320 }

</details>

### Available Installation Policies

#### Disable APK Install
Blocks the installation of applications via APK files.

- Prevents sideloading
- Does not affect apps already installed

---

#### Block New Apps
Monitors the device for newly installed applications.

When enabled:

- Any **newly detected app** is automatically blocked
- If the user opens a newly installed app, the system immediately exits the app
- The app remains unusable until it is explicitly approved

Approval workflow:
1. Open the **Apps** tab
2. Navigate to **Managed**
3. Approve the blocked application

When an app is detected as new, it will show as **Detected**. Tap it to review, then approve.

<details>
<summary>Image</summary>

![Detected app in Managed list](/assets/detected-app.png){ width=320 }

</details>
<details>
<summary>Image</summary>

![Allow open prompt](/assets/allow-open.png){ width=320 }

</details>

> This feature allows app updates to continue without disabling APK installs, while still preventing access to newly installed apps.

> Note: This feature was previously unstable but is now considered fixed and reliable.

---

#### Allow Store on Lock Screen  
*(Previously labeled “Allow User Updates”)*

Controls whether the **Store** tab is accessible from the lock screen.

- When enabled, the Store tab is visible and usable on the lock screen
- When disabled, Store access requires device unlock

> This setting should be interpreted as **allowing Store access on the lock screen**, not user-driven app updates.

---

#### Block Play Store
Hides the Google Play Store application.

- This is a convenience shortcut
- The Play Store can also be blocked from the **App Management** screen
- Blocking hides the app rather than uninstalling it

---

### Block New Apps: Usage Notes

- Every new app installed while **Block New Apps** is enabled will be blocked by default
- Existing apps are unaffected
- This approach allows:
  - App updates to continue normally
  - Strict control over newly added applications

Blocked apps must be manually approved from the **Apps → Managed** section before they can be used.