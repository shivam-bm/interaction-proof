# React Native and Expo

Use this adapter with the target platform reference. Cross-platform code does not replace platform proof.

## Pin the stack

Inspect the target app's `package.json`, lockfile, Expo configuration, native directories when present, and installed dependency source. Record:

- React Native and Expo versions.
- Hermes and New Architecture status.
- Development, Expo Go, development-build, preview, and release differences.
- React Navigation or Expo Router versions and navigator types.
- Reanimated, Worklets, Gesture Handler, Screens, Safe Area Context, and modal or sheet libraries.
- React Compiler status and platform-specific files.

Use `node scripts/detect-environment.ts --root <app>` to seed this inventory. Verify values the script cannot derive.

## Navigation proof

Measure distinct timestamps for input, acknowledgement, transition start, transition end, interactivity, and content readiness. React Navigation stack events such as `transitionStart`, `transitionEnd`, `gestureStart`, `gestureEnd`, and `gestureCancel` can instrument supported navigators. Confirm the installed navigator exposes the event before relying on it.

Exercise rapid repeat navigation, back or dismissal during loading, deep links, nested navigators, tab reselection, state restoration, frozen or detached screens, and async work triggered by focus.

## Reanimated and gestures

Inspect worklets, shared-value ownership, animated properties, gesture composition, interruption, cancellation, final-state synchronization, and JS/UI runtime crossings. Prefer frame callbacks or platform traces for frame evidence. Keep development-build observations separate from release behavior.

Exercise slow and fast gestures, direction reversal, activation thresholds, simultaneous and exclusive gestures, transformed hit targets, nested scroll containers, and accessibility alternatives.

## Drawers, sheets, and modals

Inspect whether the surface is a navigator, native modal, portal, sibling overlay, or library-managed host. Prove stacking and focus on the target platform; CSS or React tree order alone does not establish native presentation order.

Exercise presentation over every supported parent, keyboard presence, nested confirmation, background tap, interactive dismissal, blocked dismissal, rotation or resize, screen-reader focus, and restoration after interruption.

## Performance

Profile release-like builds. Distinguish JS runtime stalls, UI thread work, native commit or render hitches, image or list pressure, bridge or synchronization cost, and data fetching. A smooth UI-thread animation can coexist with stale JS state; prove both motion and final semantics.

Useful current sources:

- React Native performance: https://reactnative.dev/docs/performance
- React Navigation events: https://reactnavigation.org/docs/navigation-events/
- Reanimated performance: https://docs.swmansion.com/react-native-reanimated/docs/guides/performance/
- Gesture Handler: https://docs.swmansion.com/react-native-gesture-handler/
- Expo development builds: https://docs.expo.dev/develop/development-builds/introduction/

Record the access date when version-sensitive guidance drives a verdict.
