# Lock Screen

The lock screen is the local gate into the MDM app.

## Access Model

- Entry requires local PIN.
- Wrong PIN attempts remain local and do not replace account credentials.

## Recovery

- Forgot-PIN flow is available from lock/auth flows.
- Device-owner recovery tools are available through hidden admin actions in setup/auth contexts.

## Optional Store Access

If enabled by policy, limited Store access can be shown from lock context.
