# Coverage Ledger

The ledger makes coverage explicit before the audit begins.

## Scopes

- **Interaction:** one action and its feedback loop.
- **Surface:** every meaningful interaction and state on one rendered surface.
- **Journey:** the entry, decisions, transitions, completion, interruption, and recovery of one task.
- **Release:** critical journeys across a risk-based environment matrix.

## Ledger fields

Create one row per claim or environment condition:

| Field | Question |
| --- | --- |
| Person | Who performs the task, with what capability or role? |
| Task | What concrete outcome are they pursuing? |
| Entry state | What must already be true? |
| Action | What input starts or advances the interaction? |
| Feedback | What immediate acknowledgement appears? |
| Completion | How does the person know the action finished? |
| Cancellation | Can the action be interrupted or reversed safely? |
| Recovery | What happens after failure, denial, backgrounding, or retry? |
| Alternative | Can essential functionality be reached through another input mode? |
| Environment | Which platform, device, state, locale, and settings apply? |
| Expected | What source defines correct behavior? |
| Proof target | Which rung is required? |
| Outcome | What did the audit establish? |

## Experience domains

Account for each applicable domain:

1. Task completion and consequence clarity.
2. Navigation, hierarchy, deep links, and restoration.
3. Tap, drag, swipe, fling, cancellation, and gesture conflicts.
4. Motion intent, continuity, interruption, and reduced motion.
5. Responsiveness, loading, scrolling, launch, and resume.
6. Accessibility semantics, focus, text scaling, contrast, and alternative input.
7. Adaptive layout, orientation, resize, safe areas, and appearance.
8. Keyboard, pointer, stylus, permissions, and system presentations.
9. Visual, audio, and haptic feedback.
10. Offline, slow, partial, repeated, expired, and low-resource states.
11. Localization, right-to-left layout, dates, numbers, and content expansion.
12. Privacy, permission timing, denial, and sensitive information exposure.
13. Memory, energy, thermal, network, storage, and background behavior that reaches the person.

## Risk selection

Prioritize combinations with high task importance, broad reach, fragile implementation, recent change, known incident history, weak hardware, constrained layouts, assistive technology, or destructive consequences.

For every excluded combination, record why a neighboring result is representative. Sampling without a rationale is missing coverage.

## Completion test

Coverage is complete when every in-scope row has an outcome and every omitted domain or environment has an explicit exclusion rationale. A release audit cannot pass while critical rows remain `BLOCKED`.
