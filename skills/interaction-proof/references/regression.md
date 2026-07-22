# Regression

Use this branch for before/after comparison or an approved fix.

## Baseline

Freeze the revision, build, device, OS, settings, account and data state, network profile, steps, capture tools, repetition count, and raw artifacts. Record known failures separately from the target failure.

## Candidate

Change only the authorized scope. Recreate the baseline environment before comparing. If an exact match is impossible, record the mismatch before interpreting results.

## Rerun

Repeat the original claim, its cancellation and recovery paths, and adjacent interactions sharing navigation, presentation, gesture, state, or performance infrastructure.

## Comparison outcomes

- `FIXED`: the original failure no longer reproduces at equal or stronger proof.
- `IMPROVED`: the measured result improves but does not meet the acceptance condition.
- `UNCHANGED`: the result remains within the declared tolerance.
- `REGRESSED`: a target or adjacent claim worsens beyond tolerance.
- `INCOMPARABLE`: an environment mismatch prevents interpretation.

## Closure

Close a failure only when the rerun reaches equal or stronger proof than the baseline. Keep new regressions separate from unresolved baseline defects. Preserve raw samples and the exact rerun command or steps.
