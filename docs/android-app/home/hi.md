# Hi

## Where it lives
- `app/src/main/java/com/tripleu/ui/fragments/HomeFragment.kt`
- `app/src/main/java/com/tripleu/ui/fragments/HomeScreenContent.kt`
- `app/src/main/java/com/tripleu/content/TechTakeRepository.kt`

## What it does
- Shows the greeting title + subtitle in the Hero card.
- Uses Firebase user display name when available.
- Falls back to email prefix, then the default string ("there").
- Shows the "Tech take of the day" block (title + date + take text).

## Code path
- `HomeFragment.updateGreetingName()` builds the `greetingName`.
- `HomeFragment.refreshAll()` loads the tech take via `TechTakeRepository.loadTechTake()`.
- `HomeScreenContent.HeroCard()` renders the greeting and `TechTakeBlock`.
- `TechTakeBlock` selects Hebrew/English by locale and uses `home_tech_take_empty` as fallback.
- `TechTakeRepository` caches the latest take in `tech_take_prefs` for offline use.
