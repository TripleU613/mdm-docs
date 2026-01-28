# Permissions & Installation

## Required Permissions (After Account Setup)

After you finish account setup and verification, TripleUMDM opens the **Permissions** screen. The app requires **two mandatory permissions** and will not continue until both are granted.

<details>
<summary>image</summary>

![Permissions screen](/assets/permissions.png){ width=320 }

</details>

### Required Permissions

1. **Device Owner**
   - This must be **Device Owner**, not Device Administrator.
   - Granted either:
     - Automatically by the **web installer**
     - Manually via **ADB**
   - If Device Owner is not set, the app will not function.

2. **Write Secure Settings**
   - This permission allows the app to modify secure system settings.
   - Granted either:
     - Automatically by the **web installer**
     - Manually via **ADB**
   - There is also a **Self Grant Permissions With Root** button. We are not covering that path yet.

---

## Common Issues and Workarounds

### Device Owner Blocked by Existing Accounts

Some devices already have user accounts configured (e.g. Google accounts, WhatsApp accounts).
These accounts can **prevent setting Device Owner**.

You have two options:

#### Option A: Remove Accounts (Destructive)

- Remove all user accounts from the device
- Run the Device Owner command again

#### Option B: Temporarily Disable Account Apps (Non-Destructive)

Instead of removing accounts, you can temporarily disable the app that owns the account.

Example for WhatsApp:

```bash
adb shell pm disable com.whatsapp
```

1. Disable the app hosting the account
2. Run the Device Owner command
3. Re-enable the app:

```bash
adb shell pm enable com.whatsapp
```

This allows Device Owner to be set **without deleting user data**.

---

### Write Secure Settings Issues on OnePlus Devices

Some **OnePlus devices** restrict `WRITE_SECURE_SETTINGS` by default.

If the permission fails:

1. Open **Developer Options**
2. Enable the setting that allows granting secure settings permissions
3. Retry the ADB grant command

> Most other Android devices do not have this issue.

---

## Installation Methods

### Option 1: Web Installer (Recommended)

When installing the app from the web installer at:

https://tripleumdm.com

Both **Device Owner** and **Write Secure Settings** permissions are automatically executed as part of the installation process.

No manual steps are required.

---

### Option 2: Manual Installation via ADB

If you install the app manually, both permissions must be granted using ADB commands.

#### Grant Write Secure Settings

```bash
adb shell pm grant com.tripleu.mdm android.permission.WRITE_SECURE_SETTINGS
```

#### Set Device Owner

The app must be set as **Device Owner** via ADB.
This is **not** the same as Device Administrator.

```bash
adb shell dpm set-device-owner "com.tripleu.mdm/.a"
```

> The device admin receiver class is `com.tripleu.mdm/.a`.