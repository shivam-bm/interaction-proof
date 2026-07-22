# Mobile interaction release matrix

## Release contract

- Critical journeys: sign in, open Home, add a customer, recover an interrupted submission, and sign out.
- Critical accessibility paths must complete with VoiceOver on iOS and TalkBack on Android.
- Supported platforms: iOS 18 and newer; Android API 29 and newer; phone and tablet layouts.

## Available environments

1. iPhone 15 Pro, iOS 19, release build, 120 Hz, en-US, default accessibility settings, normal and offline network. All critical journeys completed in 10 repeated runs. VoiceOver was not exercised.
2. Pixel 8 emulator, API 36, release build, 60 Hz, en-US, default accessibility settings, normal network. Sign in, Home, add customer, and sign out completed in 5 runs. Offline recovery and TalkBack were not exercised.
3. iPad simulator, iPadOS 19, release build, landscape and portrait. Home and Add Customer completed in 3 runs. Largest text and Stage Manager were not exercised.

## Unavailable combinations

- Oldest supported iPhone, oldest supported Android API, weak Android hardware, physical Android device, 60 Hz iPhone, high-refresh Android, TalkBack, VoiceOver, largest accessibility text, right-to-left locale, Reduce Motion, thermal pressure, process death, and production field evidence.
- No performance traces or participant studies are supplied.
