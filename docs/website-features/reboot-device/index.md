# Reboot Device (Remote Command)

The website can issue a **reboot command** to a managed device.

## Requirements

- The device is enrolled as **Device Owner**
- Android 7.0+ (DevicePolicyManager reboot support)

## Behavior

- The device restarts immediately after the command is received
- Use this after critical changes or if the device is unresponsive

> This is a **remote command** and will interrupt the user. Use carefully.

