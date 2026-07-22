# Apple Platforms

Use this branch for iOS and iPadOS, including SwiftUI, UIKit, React Native, and Expo surfaces. Align claims with public Apple guidance and the app's supported OS versions; do not imply Apple certification or private internal standards.

## Sources of truth

Prefer, in order:

1. The product requirement and established app behavior.
2. Current Apple Human Interface Guidelines and developer documentation.
3. The target SDK headers, installed framework source, and project configuration.
4. Observed runtime behavior on the supported device and OS.

Useful public sources:

- Human Interface Guidelines: https://developer.apple.com/design/human-interface-guidelines/
- Accessibility: https://developer.apple.com/design/human-interface-guidelines/accessibility/
- Gestures: https://developer.apple.com/design/human-interface-guidelines/gestures
- Privacy: https://developer.apple.com/design/human-interface-guidelines/privacy/
- Localization: https://developer.apple.com/localization/
- Responsiveness: https://developer.apple.com/documentation/xcode/improving-app-responsiveness
- Performance: https://developer.apple.com/documentation/xcode/improving-your-app-s-performance

Record the access date when current documentation materially affects a verdict.

## Tool ladder

- Use Simulator and `simctl` for deterministic layout, lifecycle, locale, appearance, and basic interaction evidence.
- Use Accessibility Inspector and assistive technologies for semantic, focus, action, and alternative-input evidence.
- Use XCTest or XCUITest for repeatable behavior and performance protocols.
- Use physical hardware for haptics, sensors, refresh rate, thermal, memory pressure, and release performance.
- Use Instruments templates such as Animation Hitches, Time Profiler, Allocations, Leaks, Network, and Energy Log for trace claims.
- Use Xcode Organizer, MetricKit, TestFlight feedback, and crash or hang diagnostics for field claims.

## Interaction matrix

Exercise applicable combinations:

- Standard tap, long press, edge swipe, drag, fling, cancellation, reversal, and simultaneous gesture.
- Back navigation, interactive dismissal, modal presentation, nested presentation, and state restoration.
- Software and hardware keyboard, pointer, trackpad, Apple Pencil, VoiceOver, Voice Control, Switch Control, and Full Keyboard Access.
- Dynamic Type through the largest supported accessibility size, Display Zoom, bold text, increased contrast, reduced transparency, and Reduce Motion.
- Light and dark appearance, portrait and landscape, safe areas, call or hotspot status changes, and external-display conditions when supported.
- iPad resizing, Split View, Stage Manager, pointer interaction, keyboard shortcuts, and popover or sheet adaptation.
- Permission first request, denial, limited access, later grant, and Settings return.
- Background, foreground, interruption, memory warning, process termination, deep link, and restoration.
- Left-to-right and right-to-left locales, long localized content, locale-sensitive dates and numbers, and localized purpose strings.

## Release hardware

Select at least the weakest supported device, a representative current device, the smallest supported layout, the primary iPad configuration, 60 Hz hardware, and high-refresh hardware when supported. State the risk rationale for every chosen device.

## Performance interpretation

Separate app launch, first useful content, input acknowledgement, transition duration, content readiness, hitch rate, hang time, memory, energy, network, and storage. Apple tools report different failure classes; preserve that distinction in the verdict.
