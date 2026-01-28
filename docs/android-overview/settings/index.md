# Settings Tab

The **Settings** tab contains account-level actions, application preferences, maintenance tools, and destructive operations.  
Use caution with account and uninstall options.

<details>
<summary>Image</summary>

![Settings tab (part 1)](/assets/settings-1.png){ width=320 }

</details>
<details>
<summary>Image</summary>

![Settings tab (part 2)](/assets/settings-2.png){ width=320 }

</details>

---

## General Options

### Open MDM Portal
Opens the MDM web portal inside an in-app web view.

---

### Switch Language (Hebrew / English)
Toggles the app language between:

- English
- Hebrew

You can switch back and forth at any time.

---

### App Density
Controls how dense the UI layout appears.

- Especially useful for **small-screen devices**
- Adjusts spacing and layout compactness

<details>
<summary>Image</summary>

![App density options](/assets/app-density.png){ width=320 }

</details>

---

## Profiles

### Export Profile
Exports the **entire MDM configuration** as a snapshot file.

- Includes current policies and settings
- Intended for transferring configurations to another MDM instance

### Import Profile
Imports a previously exported MDM configuration file.

> ⚠️ **Warning:**  
> Profile import/export is not well maintained and may behave unexpectedly.  
> Use with caution.

---

## Account Information

### Account Info
Displays:

- **Device ID**
- **Account email address**

<details>
<summary>Image</summary>

![Account info](/assets/account-info.png){ width=320 }

</details>

---

### Reset MDM PIN
Resets the **local app PIN** used to access the MDM app.

- Does not affect your account password
- Applies only to this device

---

### Delete My Account
**Permanently deletes your account and all associated devices.**

Behavior:

- Uninstalls MDM
- Deletes your account
- Removes all devices under the account
- **Permanently bans the email address** from future use

> ⚠️ **Critical Warning:**  
> This action is irreversible.  
> Accounts deleted this way cannot be restored, and the email address can never be used again.  
> This is due to the difficulty of manual data deletion.

---

## Updates and Maintenance

### Check for App Updates
Manually checks for updates to:

- The MDM app itself

> Updates also occur automatically in the background.

---

### Muted Updates
Shows updates that have been muted or suppressed.

- Exists here because there is no other dedicated location

---

### Clear Cache
Manually clears MDM cache data.

- Standard system cache clearing is not possible due to MDM privileges
- This provides a controlled alternative

---

## Links

### Privacy Policy
Opens the Privacy Policy.

---

### Support Us
Opens a link to support the project.

---

## Uninstall

### Uninstall MDM
Reverts all applied policies and uninstalls the MDM application from the device.

---

## Summary

- Settings includes UI, account, and maintenance controls
- Profile import/export exists but is unstable
- Account deletion is **permanent and irreversible**
- PIN resets and cache clearing are device-local actions
- Use uninstall and delete options with extreme caution