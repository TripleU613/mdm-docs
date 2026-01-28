# Store Tab

The **Store** tab serves two distinct roles depending on context:

- **Admin Store (in-app, unlocked mode)**
- **User Store (lock screen mode)**

This allows administrators to control which apps are available while still giving users a structured way to request additional apps.

---

## Admin Store (In-App)

The admin-facing Store tab is accessible when the device is unlocked and managed.

<details>
<summary>Image</summary>

![Store tab (admin mode)](/assets/store-tab.png){ width=320 }

</details>

### Updates Tab
- Displays all apps with available updates
- Includes an **Update All** option
- Allows administrators to review update status in one place

---

### Apps Tab
Used to define which apps are available to the user.

Available actions:

- **Add an app manually**
  - Enter a package name directly
- **Import an app list**
- **Search by keyword**
  - Typing a few words shows suggested package names

<details>
<summary>Image</summary>

![Add apps in admin Store](/assets/store-admin-add.png){ width=320 }

</details>
<details>
<summary>Image</summary>

![Search apps by keyword](/assets/store-search.png){ width=320 }

</details>

Once an app is added:

- It becomes visible to the user in **lock screen Store mode**
- The user can install it without admin interaction

---

## User Store (Lock Screen)

The user-facing Store is available only when the following setting is enabled:

- **Installation tab → Show Store on Lock Screen**

<details>
<summary>Image</summary>

![Store link on lock screen](/assets/store-lockscreen.png){ width=320 }

</details>

When enabled:

- A **Store** link appears on the lock screen
- Users can view apps explicitly approved by the administrator
- Users can install approved apps directly

---

### App Requests (User-Initiated)

From the lock screen Store, users can request additional apps.

Request methods:

- Enter a **package name**
- **Import a list**
- Type keywords to receive **package suggestions**

Once submitted:

- The request appears in the **Admin Store → Pending Requests**
- The app is not available until approved by an administrator

<details>
<summary>Image</summary>

![User requesting apps](/assets/store-user-request.png){ width=320 }

</details>

---

## App Requests (Admin Review)

In the admin Store tab:

- All user requests appear under **Pending Requests**
- Admins can review and approve requested apps
- Approved apps immediately become available in the user Store

<details>
<summary>Image</summary>

![Admin review of requests](/assets/store-admin-requests.png){ width=320 }

</details>

---

## Website Integration (Overview)

Using the web portal, administrators can perform the same Store actions as in-app:

- Add apps
- Approve requests

Additionally, the website allows:

- **Remote APK push to devices**

> Remote APK deployment is documented separately under the **Remote Access** section of the website.

---

## Summary

- The Store tab operates in **admin mode** and **user lock screen mode**
- Admins define which apps are available
- Users can request additional apps in a controlled way
- App requests require explicit admin approval
- The web portal extends Store functionality with remote APK deployment