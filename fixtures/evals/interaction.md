# Profile drawer opening drag

## Product contract

- Person: signed-in field representative.
- Task: open the Profile drawer from Home.
- The drawer should remain attached to the finger, support reversal and cancellation, settle in the matching final state, and provide a labeled button alternative.
- Smooth drag behavior is release-critical.

## Source environment

- Revision: `eval-interaction`.
- Stack: React Native 0.81, Reanimated 4, Gesture Handler 2.
- Platform target: iOS.
- The drawer uses a pan gesture to update a Reanimated shared value and exposes an `Open profile` button.
- The cancellation callback sets the final open state from the shared-value threshold.

## Available evidence

- Source locations: `src/profile-drawer.tsx:40-118` and `src/home-header.tsx:22-41`.
- No app build, simulator run, device recording, frame trace, accessibility run, or participant evidence is available.
