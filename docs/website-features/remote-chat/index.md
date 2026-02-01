# Remote Chat (Admin ↔ Device)

The **Remote Chat** feature lets the **device owner** and the **admin** chat in real time.

## Where it lives

- **Website:** Remote Control → **Chat** tab
- **Android:** Lock screen → **Chat with admin**

## Availability

- Requires **Remote Access** to be enabled for the device
- The Chat tab only appears for **app versions newer than v4.1.1**
  - **Dev builds** always show Chat

## How it works

- Chat is **per device**
- The **device ID** is the client
- The **device owner email** is the account contact
- Admin can reply even if the device user is offline

## Start a conversation

1. Add a **Subject**
2. Add the **first message**
3. Chat opens immediately

## Features

- **Typing indicators**
- **Read status** (shown on the latest admin message)
- **Attachments** (max **50 MB**) — images preview inline, other files show as downloads
- **Export chat** (TXT / JSON)
- **Delete chat**

## Mobile web

On small screens, Chat uses a **single‑column** layout:

- **Conversations list** → tap one to open
- **Back** to return to the list
- **New chat** button starts a new conversation

## Notifications

When the admin replies, the device receives a **system notification**:

- Title: **New message from admin**
- Body: the message text or attachment name

## Retention

Messages are **auto‑deleted after 10 days**.

---

If the device cannot chat, verify that **Remote Access** is enabled for that device.

If no conversations appear on the website, make sure you are signed in with the **device owner’s email**.
