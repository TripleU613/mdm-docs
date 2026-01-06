# Directus

## Overview
- Runs on `kvylock` in Docker (`directus` + `directus-postgres`).
- Image: `directus/directus:10.13.1`.
- Local port: `127.0.0.1:8055`.
- Postgres: `directus-postgres` on `127.0.0.1:5432`.
- Public path: `https://vpn.kvylock.com/directus/` (Nginx reverse proxy, basic auth user `tripleu`, PIN `Aa45301826`).
- Storage:
  - Postgres data: `/opt/directus/postgres`.
  - Uploads: `/opt/directus/uploads`.
  - Extensions: `/opt/directus/extensions` (currently empty).

## Auth + access
- Admin credentials live in `/opt/directus/.env`.
- Server-side callers fall back to admin login when `DIRECTUS_TOKEN` is not set.
- Website uses a Directus API token from `NEXT_PUBLIC_DIRECTUS_TOKEN`.
- Cloud Functions also use a Directus token from env.

## Config + env
- Env file: `/opt/directus/.env`.
- Keys present: `KEY`, `SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `DB_*`, `PUBLIC_URL`, `CORS_*`.
- CORS origins: `http://localhost:3000`, `https://mdm.tripleu.org`.
- Directus base URL defaults to `http://127.0.0.1:8055` for local callers.

## Nginx routing
- `/directus/` -> `127.0.0.1:8055`.
- `X-Forwarded-Prefix` is set to `/directus`.

## Collections used by the system
### Website rules + categories
- `website_categories`: `id`, `name`, `visibility`, `parent_id`, `default_enabled`, `default_image_blocking`, `default_gif_blocking`, `default_word_detection`, `sort_order`.
- `websites`: `url`, `status`, `allowed`, `match_type`, `category_id`, `image_blocking`, `gif_blocking`, `word_detection`, `offensive_text_filter`.
- `bad_words`: `word`, `enabled`.

### Website rules behavior
- `visibility` controls the portal lists: `public`, `more`, `report`, `security`, `extreme`.
- `match_type` supports `contains`, `startswith`, `endswith`, `exact`, `wildcard`.
- `status` and `allowed` are normalized into allow or block decisions in `policy.py`.
- `bad_words` are used for response text filtering, not for the search blocker list.

### Device-specific overrides (VPN)
- `vpn_category_prefs`: `device_id`, `category_id`, `enabled`, `image_blocking`, `word_detection`.
- `vpn_site_overrides`: `device_id`, `host`, `enabled_override`, `image_policy`, `word_policy`.

### Override behavior
- Category prefs can override defaults and are inherited from parent categories.
- Site overrides can force allow or force block and override image or word policy.
- Device ids come from WireGuard `# device:<id>` tags and match the Android `device-<uuid>` id.
- Website VPN tab writes `vpn_category_prefs` and `vpn_site_overrides` when allowing categories or sites.

### Appeals
- `vpn_appeals`: created by the MITM portal for access appeals.
- `website_appeals`: created by the MITM portal for review/report requests.

### Appeals flow
- Portal writes `website_appeals` for review or report requests.
- Portal writes `vpn_appeals` for access requests with `device_id`.
- `appeal-approver.timer` promotes approved appeals into `websites` rules.
- Common fields captured: `url`, `host`, `request_type`, `reason`, `status`, `client_ip`, `user_agent`.
- `vpn_appeals` defaults `status` to `pending` in the MITM policy writer.
### Appeal approver behavior
- Runs every minute via `appeal-approver.timer`.
- Reads `website_appeals` with `status=approved`.
- Normalizes host from `host` or `url`.
- Ensures `Uncategorized` exists if requested category name does not match.
- Upserts `websites` with:
  - `url` set to the host
  - `match_type=endswith`
  - `status=allowed`, `allowed=true`
  - `image_blocking` and `offensive_text_filter` from the appeal fields
  - `category_id` from the requested category name

### Blocklists / allowlists
- `app_urls`: `urls` (Squid blocklist; enforced by Squid).
- `gifs`: `url` (Squid blocklist; enforced by Squid).
- `maps`: `url` (Squid blocklist notes; enforced by Squid).
- `squid-general_block`: `url` (Squid blocklist; enforced by Squid).
- `mitm_block_domains`: `domain` (and `enabled` when present).
- `mitm_ignore_domains`: `domain`.

## Field map (observed in code)
Note: fields below are the ones referenced by the server, website, or import scripts.

### website_categories
- `id`, `name`, `description`
- `visibility`, `parent_id`, `sort_order`
- `default_enabled`, `default_image_blocking`, `default_gif_blocking`, `default_word_detection`

### websites
- `url`, `status`, `allowed`, `match_type`, `category_id`
- `image_blocking`, `gif_blocking`, `word_detection`, `offensive_text_filter`

### bad_words
- `word`, `enabled`, `locale`, `severity`
- `created_at`, `updated_at`

### vpn_category_prefs
- `device_id`, `category_id`
- `enabled`, `image_blocking`, `word_detection`

### vpn_site_overrides
- `device_id`, `host`
- `enabled_override`, `image_policy`, `word_policy`

### vpn_squid_prefs
- `device_id`, `list`
- `enabled`
- `list` values: `maps`, `gifs`, `adblock`, `general`, `app_urls` (missing row = enabled).

### vpn_squid_lists
- `key`, `label`, `description`, `sort`
- Display labels for per-device Squid blocklists.

### vpn_appeals
- `url`, `host`, `category_id`, `category_name`
- `reason`, `request_type`, `status`
- `client_ip`, `user_agent`, `device_id`
- `created_at`

### website_appeals
- `url`, `host`
- `requested_category`, `requested_category_id`
- `requested_image_blocking`, `requested_offensive_text_filter`
- `reason`, `request_type`, `status`
- `client_ip`, `user_agent`, `created_at`

### app_urls
- `urls`

### gifs
- `url`

### mitm_block_domains
- `domain`, `enabled` (optional)

### maps
- `url`

### squid-general_block
- `url`

### mitm_ignore_domains
- `domain`

### app_policies
- `package_name`, `data`
- `created_at`, `updated_at`

### app_policy_rules
- `id`, `package_name`, `match_type`, `action`, `value`, `level`, `enabled`
- `created_at`, `updated_at`

### website_category_rules
- `id`, `category_id`, `match_type`, `action`, `value`, `level`, `enabled`
- `created_at`, `updated_at`

### store_apps
- `id`, `locale`, `app_id`, `title`, `url`, `data`
- `created_at`

### app_network_policies
- `package_name`, `category`, `policy_type`, `minimum_version_code`
- `created_at`, `updated_at`

### app_network_variants
- `id`, `package_name`, `level`, `user_mode`, `variant_id`, `variant_label`
- `is_default`, `mode`, `source`
- `created_at`, `updated_at`

### app_network_hosts
- `id`, `variant_id`, `host`

### apps (merged store table)
- `app_id`
- `title_en`, `title_fr`, `title_he`
- `description_en`, `description_fr`, `description_he`
- `description_html_en`, `description_html_fr`, `description_html_he`
- `summary_en`, `summary_fr`, `summary_he`
- `installs`, `min_installs`, `real_installs`
- `score`, `ratings`, `reviews`
- `histogram_en`, `histogram_fr`, `histogram_he`
- `price`, `free`, `currency`
- `sale`, `sale_time`, `original_price`
- `sale_text_en`, `sale_text_fr`, `sale_text_he`
- `offers_iap`
- `in_app_product_price_en`, `in_app_product_price_fr`, `in_app_product_price_he`
- `developer_id`
- `privacy_policy_en`, `privacy_policy_fr`, `privacy_policy_he`
- `genre_en`, `genre_fr`, `genre_he`
- `genre_id_en`, `genre_id_fr`, `genre_id_he`
- `icon`, `header_image`
- `screenshots_en`, `screenshots_fr`, `screenshots_he`
- `video`, `video_image`
- `content_rating_en`, `content_rating_fr`, `content_rating_he`
- `content_rating_description_en`, `content_rating_description_fr`, `content_rating_description_he`
- `ad_supported`, `contains_ads`, `is_recommended_in_store`
- `released`, `updated`, `version`
- `comments_en`, `comments_fr`, `comments_he`
- `url_en`, `url_fr`, `url_he`
- `app_category_id`
- `policy_type`, `policy_category`, `policy_minimum_version_code`, `policy_sha1`, `policy_network_mode`
- `created_at`, `updated_at`

## REST endpoints (Directus)
Base URL:
- Local: `http://127.0.0.1:8055`
- Public via Nginx: `https://vpn.kvylock.com/directus` (basic auth user `tripleu`, PIN `Aa45301826`)

### Auth
- `POST /auth/login` with email and password.
- Response includes an access token used as `Authorization: Bearer <token>`.

Example login:
```json
{
  "email": "admin@example.com",
  "password": "REDACTED"
}
```

Example login response:
```json
{
  "data": {
    "access_token": "TOKEN",
    "expires": 900000
  }
}
```

### Items API patterns
- List: `GET /items/<collection>?limit=-1&fields=field1,field2`
- Filter: `GET /items/<collection>?filter[field][_eq]=value`
- Create: `POST /items/<collection>`
- Update: `PATCH /items/<collection>/<id>`

Collections used by the system:
- `website_categories`, `websites`, `bad_words`
- `vpn_category_prefs`, `vpn_site_overrides`, `vpn_squid_prefs`, `vpn_squid_lists`
- `vpn_appeals`, `website_appeals`
- `app_urls`, `gifs`, `maps`, `squid-general_block` (Directus sources)
- `adblock` is local (OISD Full in `/opt/squid-blocklist/lists/oisd-full.txt`, synced daily).
- `mitm_block_domains`, `mitm_ignore_domains`

Example category list:
```http
GET /items/website_categories?limit=-1&fields=id,name,visibility,parent_id,default_enabled,default_image_blocking,default_word_detection,sort_order
Authorization: Bearer TOKEN
```

Example website rule list:
```http
GET /items/websites?limit=-1&fields=url,category_id,status,allowed,match_type,image_blocking,gif_blocking,word_detection,offensive_text_filter
Authorization: Bearer TOKEN
```

Example create vpn appeal:
```http
POST /items/vpn_appeals
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "url": "https://example.com/path",
  "host": "example.com",
  "category_id": 12,
  "category_name": "News",
  "reason": "Needed for school",
  "request_type": "appeal",
  "status": "pending",
  "client_ip": "10.9.0.3",
  "user_agent": "Android",
  "device_id": "device-uuid"
}
```

Example create website review request:
```http
POST /items/website_appeals
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "url": "example.com",
  "host": "example.com",
  "requested_category": "Technology/Internet",
  "requested_category_id": 7,
  "reason": "Not sure where this fits",
  "request_type": "review",
  "status": "pending",
  "client_ip": "10.9.0.2",
  "user_agent": "Android"
}
```

Example update category defaults:
```http
PATCH /items/website_categories/7
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "default_enabled": true,
  "default_image_blocking": false,
  "default_word_detection": true
}
```

## Request map (callers)
- MITM policy: reads `website_categories`, `websites`, `bad_words`, `vpn_category_prefs`, `vpn_site_overrides`.
- MITM portal: writes `vpn_appeals` and `website_appeals`.
- Website VPN tab: reads categories and appeals; writes category prefs and site overrides.
- Cloud Functions: reads categories and appeals; updates category defaults; resolves appeals into `websites`.
- Appeal approver: reads approved `website_appeals`, upserts `websites`.

## Integrations
- MITM proxy uses Directus for:
  - website rules, categories, bad words, and per-device overrides.
  - SNI domains and ignore list.
- Squid blocklist sync uses Directus for:
  - blocklist sources (`maps`, `gifs`, `squid-general_block`, `app_urls`).
  - local list: `adblock` (OISD Full from `/opt/squid-blocklist/lists/oisd-full.txt`).
  - per-device list toggles (`vpn_squid_prefs`).
- Website uses Directus for VPN categories, blocklists, and appeal actions.
- Cloud Functions call Directus for category defaults and website appeal actions.
  - Functions include `listWebsiteCategories`, `updateWebsiteCategory`, `listWebsiteAppeals`, `resolveWebsiteAppeal`.
- MITM server details: `vpn-wireguard`.

## Admin scripts (local)
- `/opt/directus/import_directus.py`: imports app policies, website rules, and bad words from `/opt/apps-db/policies-database.db` into Postgres.
- `/opt/directus/import_app_policies.py`: builds `app_network_*` tables from `/opt/apps-db/app-policies` JSON.
- `/opt/directus/merge_apps.py`: merges store DBs into an `apps` table.
- Backup: `/opt/directus/directus_backup.dump`.
### Tables created by `import_directus.py`
- `app_policies`, `app_policy_rules`.
- `website_categories`, `website_category_rules`.
- `bad_words`, `store_apps`.
### Ops note
- No systemd timer/service is configured for these import scripts on `kvylock`; runs are manual.

## App policy data (Postgres)
- `app_network_policies` and related `app_network_variants` and `app_network_hosts` are created by `import_app_policies.py`.
- Policies come from JSON files in `/opt/apps-db/app-policies` and are stored as host lists with variants.
- `apps` and `store_apps` tables are populated by `merge_apps.py` for app metadata.
- SQLite sources used by apps-graphql: `policies-database.db` and `store-database-<locale>.db`.

## Related services
- `appeal-approver.timer` runs `/opt/appeal-approver/approve.py` every minute to sync approved appeals into `websites`.
- `apps-graphql.service` exists but is currently disabled (serves on `127.0.0.1:8010` when enabled).
  - App code: `/opt/apps-graphql/app.py` (Ariadne + Starlette).
  - Data source: SQLite DBs in `/opt/apps-db`.
  - Login uses username and PIN from `/opt/apps-graphql/app.env`.
  - Routes: `/graphql/login`, `/graphql/logout`, `/graphql` (GraphQL endpoint).
  - Auth uses session cookies; `SessionMiddleware` is set to `https_only` with `same_site=lax`.
  - Queries cover policies, store apps, developers, app categories, bad words, and website rules.
  - Mutations upsert/delete policies, store apps, developers, categories, bad words, and rules.
  - Mutations write back to SQLite; Directus imports from SQLite via `import_directus.py`.
  - Core types: Policy, StoreApp, Developer, AppCategory, GooglePlayCategory, BadWord, AppRule, WebsiteCategory, WebsiteRule.
