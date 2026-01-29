# VPN Introduction (Premium VPN)

The **Premium VPN** is a **paid subscription** and is **not** the same as the legacy/local VPN.

This VPN is not designed to make the device “more secure” in a traditional sense. Instead, it is designed to ensure the device is **more strictly managed and supervised** through centralized, remote control.

<details>
<summary>image</summary>

![Premium VPN price](/assets/vpn-price.png){ width=520 }

</details>

---

## Subscription Overview

- The Premium VPN is a **paid, per-device subscription**
- Current price: **$5 per month**
- Subscriptions apply **per device**, not per account

> This VPN subscription also unlocks **website remote access**, meaning the separate **$2/month website subscription is not required**.

### Important Subscription Note

There is currently **no automatic cancellation** of the $2/month website subscription.

If you already have the $2 subscription:
- You **must cancel it manually** before subscribing to the Premium VPN  
- Follow the cancellation process described in the Website Subscription section

---

## VPN Activation and Connection Status

After purchasing the Premium VPN subscription, activation may not be immediate.

<details>
<summary>image</summary>

![Premium VPN overview](/assets/vpn-overview.png){ width=520 }

</details>

---

### Activating the VPN

1. After payment is completed, wait for the subscription to provision.
2. Once available, a **VPN toggle switch** will appear in the **VPN tab**.
3. Manually turn the **VPN switch ON**.

> Provisioning can take some time. This is expected.

---

### If the VPN Does Not Activate

- Wait up to **15 minutes** after enabling the VPN.
- If the VPN still does not activate:
  1. **Reboot the device**
  2. Allow the device to complete provisioning again

> VPN provisioning is a heavy operation and may require a device restart to complete successfully.

---

### Device Compatibility Note

- The Premium VPN uses the **WireGuard** protocol
- Some devices may not support WireGuard
- While this has not been commonly encountered, unsupported devices may fail to connect

---

### Verifying VPN Connection

Once payment is completed and the VPN is enabled:

1. Go to the device **lock screen**
2. Locate the **pulsing VPN status icon** (as described in earlier documentation)
3. Tap the icon to view the connection status

<details>
<summary>image</summary>

![VPN status icon on lock screen](/assets/vpn-android-lock.png){ width=520 }

</details>

#### Status Indicator

- **Green icon** → VPN is successfully connected  
- Any other state → VPN is not fully connected yet

When the icon is green, the device is fully connected to the VPN and ready to use.

---

## How the Premium VPN Works

The VPN operates using a **proxy-based traffic model** with different rules for Chrome and the rest of the system.

### Chrome Traffic (Whitelist Model)

- **Google Chrome is whitelisted**
- Only **explicitly approved websites** are allowed
- Any website not approved is blocked in Chrome

### Non-Chrome Traffic (Blacklist Model)

- The rest of the device operates on a **blacklist model**
- In-app browsers or embedded webviews may access websites
- Access is blocked **only if a domain or rule is explicitly blocked**

> At this time, **only Chrome is supported**.  
> Support for additional browsers may be added in the future.

---

## Traffic Inspection

The Premium VPN works by intercepting and inspecting traffic in real time. This includes analyzing:

- Website domain name
- Page content
- Images
- Words
- Skin color and visual indicators (content classification)

Each request is evaluated against your VPN configuration to determine whether it is allowed or blocked.

---

## Management and Updates

- The VPN is **100% remotely managed**
- All configuration is controlled via:
  - The website
  - Backend servers
- The device only stores required network addresses

### Updates

- VPN updates are **very frequent**
- No app updates are required
- Changes are applied remotely and instantly when possible

---

## Priority Support

Because the Premium VPN is a paid feature:

- Paid VPN users are **prioritized**
- Support and stability improvements favor Premium VPN subscribers over free features

---

## What This Section Covers

The following sections will briefly explain:

- VPN control options
- Website-based configuration
- How filtering rules are applied
