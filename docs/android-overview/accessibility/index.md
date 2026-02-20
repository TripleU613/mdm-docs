# Accessibility Tab

Accessibility policy handles UI-level enforcement using detection and jump-out actions.

## Major Groups

- WhatsApp restrictions
- Play Store section restrictions (for selected surfaces)
- In-app AI blockers
- In-app browser blocking model
- Telegram feature blockers
- Split-screen guard

## Telegram Blockers

Telegram controls are detector-based and include:

- Search
- Stories
- Groups
- Channels
- Bots
- In-app browser
- GIFs/stickers
- Profiles

Use all relevant sub-switches for best coverage. Telegram UI updates can change detector reliability.

## In-App Browser Model

- Global browser block can be enabled/disabled.
- Per-app handling is controlled from Apps policy.
- Enforcement uses fast jump-out when restricted browser overlays are detected.

## Split-Screen Guard

Split-screen is monitored and forced out when policy blocks split use.
