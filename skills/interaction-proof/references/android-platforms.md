# Android Platforms

Use this branch for Android platform behavior. Pair it with [react-native.md](react-native.md) for React Native or Expo apps.

## Sources of truth

Prefer the product requirement, current Android design and developer guidance, installed SDK and dependency source, then observed behavior on supported hardware.

Useful public sources:

- Quality guidelines: https://developer.android.com/docs/quality-guidelines/core-app-quality
- Accessibility: https://developer.android.com/guide/topics/ui/accessibility
- Adaptive layouts: https://developer.android.com/develop/ui/compose/layouts/adaptive
- Performance: https://developer.android.com/topic/performance
- Macrobenchmark: https://developer.android.com/topic/performance/benchmarking/macrobenchmark-overview
- Perfetto: https://developer.android.com/tools/perfetto

Record the access date when current guidance materially affects a verdict.

## Tool ladder

- Use Emulator for deterministic API level, layout, locale, appearance, lifecycle, and basic interaction evidence.
- Use TalkBack, Switch Access, keyboard navigation, and accessibility tooling for semantic and alternative-input evidence.
- Use Espresso, UI Automator, or Compose UI tests for repeatable behavior.
- Use physical hardware for refresh rate, thermal, memory pressure, haptics, OEM behavior, and release performance.
- Use Macrobenchmark, JankStats, system traces, Android Studio profilers, and Perfetto for trace claims.
- Use Android vitals and production crash or ANR evidence for field claims.

## Interaction matrix

Exercise predictive back or system back, gesture navigation and three-button navigation, edge gestures, touch slop, drag, fling, cancellation, nested scrolling, bottom sheets, dialogs, keyboard and IME changes, permission denial, process recreation, activity recreation, fold or resize, TalkBack, font scaling, display scaling, reduced motion where supported, right-to-left layout, dark theme, offline state, and OEM-sensitive behavior.

## Release hardware

Select weak supported hardware, a representative current device, the smallest layout, a large or adaptive layout, 60 Hz hardware, high-refresh hardware when supported, and a relevant OEM outside the reference-device family. Explain the risk each device represents.

## Performance interpretation

Separate startup, input acknowledgement, transition duration, content readiness, slow or frozen frames, ANRs, memory, thermal state, energy, network, and storage. Do not infer device performance from emulator timing.
