# Hi

Where it lives:
- `app/src/main/java/com/tripleu/ui/fragments/HomeFragment.kt`
- `app/src/main/java/com/tripleu/ui/fragments/HomeScreenContent.kt`

What it does:
- Shows the greeting title + subtitle in the Hero card.
- Uses Firebase user display name when available.
- Falls back to email prefix, then the default string ("there").

Code path:
- `HomeFragment.updateGreetingName()` builds the `greetingName`.
- `HomeScreenContent.HeroCard()` renders `home_greeting_title` and `home_greeting_subtitle`.
