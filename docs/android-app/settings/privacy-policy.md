# Privacy policy

## Where it lives
- `app/src/main/java/com/tripleu/ui/fragments/SettingsFragment.kt`
- `app/src/main/java/com/tripleu/ui/activities/PrivacyPolicyActivity.kt`

## What it does
- Opens the privacy policy inside the app.

## How it runs
- Starts `PrivacyPolicyActivity`.
- A WebView loads:
  - `https://github.com/TripleU613/TripleUMDM_Public/blob/main/Privacy.md`
- Links are opened inside the same WebView.
