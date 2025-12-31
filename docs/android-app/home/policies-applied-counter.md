# Policies applied counter

Where it lives:
- `app/src/main/java/com/tripleu/ui/fragments/HomeScreenContent.kt`
- `app/src/main/java/com/tripleu/ui/home/PolicySummaryProvider.kt`

What it does:
- Shows the "Policies applied" number in the Hero card.
- The value is the count of enabled policy items across all sections.

Code path:
- `HomeScreen()` builds `policySections` and sets `totalPolicies`.
- `HeroCard()` renders `home_highlight_policies` with `totalPolicies`.
