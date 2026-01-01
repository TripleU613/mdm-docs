# Did you know

## Where it lives
- `app/src/main/java/com/tripleu/ui/fragments/HomeScreenContent.kt`
- `app/src/main/res/values/strings.xml`

## What it does
- Shows a single tip card with the title "Did you know?"
- Tips are hardcoded in `homeTips` and map to string resources.
- The tip rotates each time the Home screen resumes.

## Code path
- `HomeFragment.onResume()` increments the tip index.
- `HomeScreenContent.homeTips` defines the tip list.
- `TipCard()` renders the message text via `R.string.home_tip_*`.
