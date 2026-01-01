# Password reset

Where it lives:
- `app/src/main/java/com/tripleu/ui/activities/ResetPage.kt`

What it does:
- Sends a password reset email using Firebase Auth.

How it runs:
- User enters the email address.
- Calls `FirebaseAuth.sendPasswordResetEmail(email)`.
- On success, returns to the previous screen.
