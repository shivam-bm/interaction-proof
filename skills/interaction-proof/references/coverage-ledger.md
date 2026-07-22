# Coverage Ledger

The ledger makes coverage explicit before evidence collection. Use one canonical claim record for planning, proof, and verdicts.

## Claim record

Create one record per claim and environment condition:

| Field | Requirement |
| --- | --- |
| `id` | Stable unique identifier. |
| `domain` | One experience domain from the list below. |
| `claimType` | `source`, `runtime`, or `human`. |
| `critical` | Whether blocking or failing this claim prevents release. |
| `person` | Person, capability, or role performing the task. |
| `task` | Concrete outcome the person pursues. |
| `entryState` | Preconditions before the action. |
| `action` | Input that starts or advances the interaction. |
| `feedback` | Immediate acknowledgement. |
| `completion` | Observable completion signal. |
| `cancellation` | Interruption or reversal behavior. |
| `recovery` | Behavior after failure, denial, backgrounding, or retry. |
| `alternative` | Equivalent route through another input mode. |
| `environmentId` | Identifier from the report's environment matrix. |
| `claim` | One falsifiable statement. |
| `expected` | Correct behavior and its source. |
| `observed` | Direct observation, kept separate from interpretation. |
| `status` | One outcome from the proof contract. |
| `proofTarget` | Minimum evidence rung needed for this claim. |
| `proofLevel` | Evidence rung actually achieved. |
| `evidence` | Stable artifact identifiers. |
| `reproduction` | Exact steps or protocol. |
| `confidence` | `high`, `medium`, or `low`. |

Use a non-empty explanation such as `NOT_APPLICABLE — no dismissible state exists` for any interaction field that does not apply. Add `severity`, `blocker`, `reason`, or `studyQuestion` when the selected outcome requires it.

Each environment record includes a `riskRationale`. Put omitted domains in `coverage.excludedDomains` and omitted device, state, or platform combinations in `coverage.excludedEnvironments`; every exclusion carries a reason.

Pass selected domain IDs to `create-ledger.ts --domains task,gesture,...`; the generator creates claim starters for those domains and exclusion-rationale placeholders for the rest.

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

Prioritize combinations with high task importance, broad reach, fragile implementation, recent change, incident history, weak hardware, constrained layouts, assistive technology, or destructive consequences.

Record why each excluded combination is represented by neighboring evidence. Sampling without a rationale remains uncovered.

## Completion test

Coverage is complete when every in-scope record has a final outcome and every omitted domain or environment has an exclusion rationale. A release audit cannot pass while a critical record remains `BLOCKED` or `FAIL`.
