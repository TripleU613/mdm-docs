# Security

## Remote uninstall flag

### Where it lives
- `app/src/main/java/com/tripleu/MainActivity.kt`

### What it does
- Allows the portal to trigger an uninstall via a Firestore flag.

### How it runs
- Listens to `users/{uid}` for `pendingUninstall`.
- If true:
  - Clears the flag (`pendingUninstall=false`).
  - Reverts policies and clears device owner.
  - Starts `Intent.ACTION_DELETE` for the app package.

## Blocked email uninstall

### Where it lives
- `app/src/main/java/com/tripleu/MainActivity.kt`

### What it does
- Forces uninstall if the signed-in email is in the blocked list.

### How it runs
- Reads Firestore `bannedEmails/{email}` once on launch.
- If the current email doc exists and the app is device owner:
  - Reverts policies and clears device owner.
  - Starts `Intent.ACTION_DELETE` for the app package.
