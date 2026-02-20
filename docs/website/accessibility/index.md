# Accessibility Tab (Website)

Accessibility tab controls app UI-surface blockers enforced by the device accessibility service.

## Includes

- WebView block-all behavior
- In-app AI restrictions
- WhatsApp feature blockers
- Telegram feature blockers (including Stories)
- Android Auto quirk toggles

## Rollout Pattern

1. Change one policy group at a time.
2. Save and wait for sync.
3. Validate with a real app flow on device.

## Troubleshooting

- False jump-outs: check overlapping blockers.
- Missed detections: validate current detector logic against new app UI layout.
