# Lock Screen

After completing setup, the app opens to the **Lock Screen**.  
This is the default entry point to the MDM and requires authentication before any managed features can be accessed.

<details>
<summary>image</summary>

![MDM lock screen showing PIN entry, device info, and lock status icon](/assets/lock-screen.png){ width=320 }

</details>

---

## PIN Authentication

- You must enter your **MDM PIN** to unlock the app
- The PIN is required every time you access the MDM interface
- The **Enter** button sits next to the PIN field for faster unlock

---

## Device Information

The Lock Screen displays:

- **Account email address**
- **Device ID**

This information is always visible and helps identify the device at a glance.

---

## Network Status Indicator

At the top of the screen, there is a **pulsing lock icon**.

- **Green lock**  
  Network connection is healthy and functioning correctly

- **Orange lock**  
  Indicates a network or connectivity issue

The pulsing animation reflects real-time connection status.

---

## Forgotten PIN or Password Recovery

### Forgot MDM PIN
If you forget your PIN:

1. Enter your **email address**
2. Verify your credentials
3. Reset the PIN after successful verification

<details>
<summary>image</summary>

![Forgot access code](/assets/forgot-pin.png){ width=320 }

</details>

---

### Forgot Account Password
If you forgot your account password:

- Use the password recovery link
- Your password will be sent to your email address

---

## Store Access from Lock Screen

If enabled in:

- **Installation tab → Show Store on Lock Screen**

Then the Lock Screen includes a link to the **Store**.

- Allows users to view and install approved apps
- Also allows requesting new apps (if permitted)
- Appears as a **split action** next to **Chat with admin**

## Chat with Admin (Lock Screen)

Users can open a **live chat** with the admin directly from the Lock Screen.

- Opens the Remote Chat feature
- Useful for support without unlocking the app

---

## Forgot PIN

The **Forgot access code** link is placed below the quick actions.
Use it to reset the MDM PIN when needed.

---

## Summary

- The Lock Screen is the primary access gate for the MDM
- PIN authentication is always required
- Network status is visually indicated by the lock icon
- Account recovery options are available directly from this screen
- Optional Store access can be exposed on the Lock Screen
