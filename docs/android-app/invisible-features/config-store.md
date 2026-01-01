# Config store (local SQLite)

Where it lives:
- `app/src/main/java/com/tripleu/config/ConfigStore.kt`
- `app/src/main/java/com/tripleu/config/ConfigDbHelper.kt`

What it does:
- Stores app config entries in `config.db` (table `config_entries`).
- Each entry has `config_key`, `config_value`, `config_type`, `updated_at`.
- Writes are async on a single-thread executor.

How it runs:
- `initialize()` sets up `ConfigDbHelper`.
- `putString/Boolean/Int/Long/Json` writes with `CONFLICT_REPLACE`.
- `getAll()` returns `ConfigEntry` rows for sync and snapshot.
- `delete()` removes a key; `shutdown()` stops the executor.
