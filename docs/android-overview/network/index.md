# Network Tab

The **Network** tab controls VPN behavior and device-level network restrictions.

<details>
<summary>image</summary>

![Network tab overview](/assets/network-tab.png){ width=320 }

</details>

---

## VPN Configuration

### Legacy VPN

If you have **Premium VPN**, it appears at the top of the Network tab.  
If not, the **Legacy VPN** is used.

Legacy VPN supports two modes:

#### Exclude Mode
- VPN applies to all apps **except** selected ones
- App-level exceptions are managed in **Apps Management**

#### Include Mode
- VPN applies **only** to selected apps
- Apps must be explicitly added in **Apps Management**

<details>
<summary>image</summary>

![Include or Exclude mode selector](/assets/include-exclude-mode.png){ width=320 }

</details>

> ⚠️ **Important:**  
> If **Include Mode** is enabled and **no apps are selected**, the VPN may automatically turn itself off until at least one app is included.

All app selection and exception handling is configured through the **Apps Management** tab.

<details>
<summary>image</summary>

![Exclude apps in Apps Management](/assets/exclude-apps.png){ width=320 }

</details>
<details>
<summary>image</summary>

![Include apps in Apps Management](/assets/include-apps.png){ width=320 }

</details>

---

## VPN Traffic Controls

### Block All Traffic
Blocks **all network traffic**, effectively putting the device offline.

> ⚠️ **Warning:**  
> This may also block the MDM itself.  
> Use with extreme caution.

---

### Whitelist Mode
Allows access **only** to explicitly approved destinations.

Capabilities:

- Add allowed domains manually
- Upload a whitelist file
- Supports wildcard domains using `*`

<details>
<summary>image</summary>

![Whitelist domains example](/assets/whitelist-domains.png){ width=320 }

</details>

Behavior notes:

- Blocks everything except what is allowed
- Affects:
  - Websites
  - App traffic
  - IP connections
  - SNI-based network traffic

This is not limited to browser traffic.

---

### Blacklist Mode
Blocks access to specified destinations.

Capabilities:

- Block specific URLs
- Block domains
- Block wildcard domains using `*`

Only listed destinations are blocked; all other traffic is allowed.

---

> Whitelist and Blacklist modes work **alongside** VPN **Include** and **Exclude** modes.

---

## DNS and Network Restrictions

### Enable Private DNS
Configures a custom Private DNS provider for the device.

- Does **not** work when any VPN is active
- Applies system-wide

<details>
<summary>image</summary>

![Private DNS setting](/assets/private-dns.png){ width=320 }

</details>

---

### Disable Hotspot and Tethering
Prevents the device from sharing its internet connection via:

- Wi-Fi hotspot
- USB tethering
- Bluetooth tethering

---

### Block Wi-Fi
Completely disables Wi-Fi connectivity on the device.

- Optional and generally unnecessary
- Available for environments requiring strict network control

---

## Summary

- Legacy VPN supports include and exclude app-based routing
- VPN rules can control apps, domains, IP traffic, and SNI connections
- Whitelist mode is restrictive and impacts more than just websites
- Blocking all traffic can disrupt MDM connectivity
- DNS and network switches apply device-wide restrictions