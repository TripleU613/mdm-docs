# Accounts

This section summarizes account-level behavior.

## Core Rules

- One account can manage multiple devices, subject to slot limits.
- Account password controls account access.
- App PIN controls local access on each device.

## Verification

- Signup requires verification before full access.
- Signin for verified users is direct.

## Destructive Actions

From Settings, account deletion is permanent and removes associated account state and managed-device access for that account.

## Audit Recommendation

For production deployments, keep a controlled list of active admins and periodic checks for slot usage and verified account status.
