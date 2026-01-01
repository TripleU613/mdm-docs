# Chrome SafeSearch enforcement

Where it lives:
- `app/src/main/java/com/tripleu/policy/ChromePolicyController.kt`
- `app/src/main/java/com/tripleu/policy/PolicyManager.kt`
- `app/src/main/java/com/tripleu/config/ConfigPoller.kt`

What it does:
- Forces Google SafeSearch in Chrome.
- Disables Chrome QUIC and DNS-over-HTTPS so filtering stays enforceable.

How it runs:
- `ConfigPoller` calls `PolicyManager.setChromeSafeSearch(..., true)` each poll.
- The controller sets application restrictions for installed Chrome packages:
  - `ForceGoogleSafeSearch=true`
  - `QuicAllowed=false`
  - `DnsOverHttpsMode=off`
  - `DnsOverHttpsTemplates=""`
