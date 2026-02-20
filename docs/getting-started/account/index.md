# Account Setup

## Signup vs Signin

### Signup

Signup requires:

- Name
- Phone
- Email
- Password
- Local app PIN

After signup, email verification is required before full access is granted.

### Signin

Signin requires:

- Email
- Password
- Local app PIN

Verified users can sign in directly. Signin does not require OTP when the email is already verified.

## PIN vs Password

- **Password**: account-level credential (app and website).
- **PIN**: local unlock credential for the Android MDM app.

## Device Slot Rules

Account access depends on available device slots. If slot capacity is reached, additional signins on new devices require slot expansion.

## Hidden Recovery Action

A hidden long-press action on auth/permissions hero animations can clear device owner for recovery flows when the device is stuck during setup.

Use only for recovery. Clearing device owner removes enforced management state.

## Password Recovery

Use the Reset Password flow from the signin screen to trigger password reset through your configured backend flow.
