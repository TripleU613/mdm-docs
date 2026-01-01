# Initial config snapshot

Where it lives:
- `app/src/main/java/com/tripleu/config/ConfigSnapshotWriter.kt`
- `app/src/main/java/com/tripleu/MainActivity.kt`

What it does:
- Captures a one-time snapshot of device/app/account state.
- Stores the snapshot locally in `ConfigStore` (not uploaded).

How it runs:
- `MainActivity` calls `ConfigSnapshotWriter.ensureInitialSnapshot()` after setup.
- Runs only once and only if the app is device owner.
- Writes:
  - `snapshot.initial_payload` (JSON).
  - `snapshot.initial_written_at` (timestamp).
- Snapshot includes app version, device info, Firebase email/uid, language, density, muted packages, and all `ConfigStore` entries.
