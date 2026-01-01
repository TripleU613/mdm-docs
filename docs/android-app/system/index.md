# System tab

## Shared privacy UI shell

### Where it lives
- `app/src/main/java/com/tripleu/ui/fragments/PrivacyFragment.kt`
- `app/src/main/java/com/tripleu/ui/privacy/PrivacyScreen.kt`
- `app/src/main/java/com/tripleu/ui/privacy/PrivacyUiState.kt`

### What it does
- Renders the System/Installation/Accessibility/Network tabs using the same Compose screen.
- Builds section/toggle models (`PrivacySectionUi`, `PrivacyToggleUi`) from state.

- [Disallow adding users](./disallow-adding-users)
- [Disable factory reset](./disable-factory-reset)
- [Block developer options](./block-developer-options)
- [Disable app settings control](./disable-app-settings-control)
- [Block phone calls](./block-phone-calls)
- [Disable SMS/MMS](./disable-sms-mms)
