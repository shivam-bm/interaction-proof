# Account sheet surface

## Product contract

- Person: signed-in account owner.
- Task: review account details, change the display name, save, and dismiss the sheet.
- The surface includes a close button, editable name, save action, error recovery, keyboard handling, and screen-reader focus.
- Saving and accessible dismissal are release-critical.

## Simulator environment

- Revision: `eval-surface`.
- iOS 19 simulator, iPhone 16 layout, development build, 60 Hz simulated display.
- Locale: en-US; light appearance; default text size; seeded account; normal network.
- Five scripted runs opened the sheet, edited the name, saved successfully, and dismissed with the close button.
- One slow-network run showed progress immediately and completed after 2.1 seconds.
- One server-error run kept the edited value and succeeded on retry.
- The accessibility inspector exposed the close button as `button, Close account` and moved initial focus to the sheet heading.

## Missing evidence

- No physical-device, haptic, thermal, high-refresh, large-text, Reduce Motion, VoiceOver gesture, rotation, offline, Android, trace, or participant evidence is available.
