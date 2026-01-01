# Blocked email uninstall

Where it lives:
- `app/src/main/java/com/tripleu/MainActivity.kt`

What it does:
- Forces uninstall if the signed-in email is in the blocked list.

How it runs:
- Reads Realtime DB `blockedEmails` once on launch.
- If the current email is in the list and the app is device owner:
  - Reverts policies and clears device owner.
  - Starts `Intent.ACTION_DELETE` for the app package.
