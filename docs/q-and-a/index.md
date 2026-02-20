# Q and A

## Why can signup require verification while signin does not?

Signup creates a new account and requires email verification before full access. Verified accounts can sign in directly.

## Why does a blocked app jump out immediately?

Jump-out is expected behavior for accessibility and time policy enforcement when restricted UI/state is detected.

## Why do Telegram blockers sometimes change behavior after Telegram updates?

Telegram controls are detector-based. Telegram UI updates can change view structure and require detector updates.

## Why is VPN documentation marked legacy?

Legacy VPN website controls still exist for some accounts, but active forward path is PCAP-based network filtering.

## Why does kiosk need allowed apps first?

Kiosk enforces allowlist runtime. Without allowed apps, user flow is intentionally restricted.

## Why do some app installs fail after download?

Most failures are split/ABI/shared-library mismatches. Validate artifact set and device architecture.

## Why is an app marked time-controlled?

A schedule window or timer policy exists for that app. Clear time control to remove enforcement.

## Why does theme look different across operators?

Dashboard supports system/light/dark preference per operator session.
