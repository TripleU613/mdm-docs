# System Tab

The **System** tab contains core device-level restrictions that control user behavior and access to sensitive system features.

<details>
<summary>image</summary>

![System tab showing device restriction switches](/assets/system-tab.png){ width=320 }

</details>

### Available System Policies

#### Disallow Adding Users
Prevents additional users from being added to the device.

- Helps avoid bypassing MDM restrictions through secondary user profiles
- Applies a simple system-level restriction

---

#### Disable Factory Reset
Blocks the ability to factory reset the device.

When enabling this option:

- You may **set an FRP (Factory Reset Protection) Google account**
- Or **skip setting an FRP account**

<details>
<summary>image</summary>

![FRP screen](/assets/frp-screen.png){ width=320 }

</details>

> ⚠️ **Important:**  
> Be extremely careful when using FRP.  
> Most device recovery and troubleshooting issues are caused by incorrectly configured FRP accounts.

---

#### Block Developer Options
Prevents access to Android **Developer Options**.

- Useful for stopping advanced users from modifying system behavior
- Applies immediately when enabled

---

#### Disable App Settings Control
Blocks access to app-level management actions across the device.

When enabled, users **cannot**:

- Uninstall apps
- Clear app data or cache
- Force stop apps
- Modify individual app settings

This restriction applies to **all apps on the device**.

---

#### Block Phone Calls
Disables the ability to make phone calls using policy-based restrictions.

- This is **not** a SIM card or carrier-level block
- This is an **MDM-enforced policy**
- Reliability may vary depending on device and OS behavior

---

#### Disable SMS and MMS
Blocks SMS and MMS functionality using policy-based restrictions.

- This is **not** a network-level restriction
- If an app is recognized as an SMS or MMS application, message sending will be blocked
- Behavior depends on how the system classifies messaging apps

---

### Important Notes on Call and Messaging Restrictions

- **Block Phone Calls** and **Disable SMS/MMS** are:
  - Policy-based
  - Not enforced by the carrier or network
- Because of this, behavior may vary between devices and Android versions

These controls are intended to **limit functionality at the OS policy level**, not at the network layer.