# Remote uninstall flag

Where it lives:
- `app/src/main/java/com/tripleu/MainActivity.kt`

What it does:
- Allows the portal to trigger an uninstall via a Firestore flag.

How it runs:
- Listens to `users/{uid}` for `pendingUninstall`.
- If true:
  - Clears the flag (`pendingUninstall=false`).
  - Reverts policies and clears device owner.
  - Starts `Intent.ACTION_DELETE` for the app package.
