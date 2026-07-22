# Proof Contract

Use this contract for every audit. It is the boundary between evidence and confidence theater.

## Claim types

- `source`: implementation, configuration, dependency, or documented contract.
- `runtime`: behavior observed while the software runs.
- `human`: comprehension, learnability, comfort, desirability, trust, or preference.

## Outcomes

- `PASS`: the scoped claim holds at the stated proof rung.
- `FAIL`: the scoped claim is contradicted by evidence.
- `BLOCKED`: a named missing prerequisite prevents a verdict.
- `NOT_APPLICABLE`: the condition does not apply, with a reason.
- `HUMAN_STUDY_REQUIRED`: observable evidence cannot answer the human question.

Runtime passes require `RUN`, `DEVICE`, `TRACE`, or `FIELD`. Source evidence may identify a likely runtime failure, but reproduce it when the environment is available. Human claims require research evidence; screenshots and agent preference do not substitute for people.

## Required claim record

Record:

1. Stable identifier.
2. Claim type.
3. Expected behavior and its source.
4. Observed behavior.
5. Outcome.
6. Proof rung.
7. Environment identifier.
8. Evidence artifacts.
9. Reproduction steps.
10. Severity for failures.
11. Confidence.
12. Blocker, exclusion reason, or human-study question when applicable.

## Confidence

- `high`: direct, repeatable evidence in the target environment.
- `medium`: direct evidence with a material environment mismatch or limited repetitions.
- `low`: indirect evidence that narrows the hypothesis but does not settle it.

Lower confidence instead of overstating the claim. When evidence conflicts, preserve both artifacts and prefer the evidence closest to the target runtime.

## Severity

Assess four dimensions independently:

- **Impact:** consequence for the person or their data.
- **Reach:** affected people, devices, states, or task frequency.
- **Reproducibility:** consistency under the pinned protocol.
- **Confidence:** strength of the proof.

Issue one level:

- `BLOCKER`: crash, data loss, essential task failure, or essential accessibility path unavailable.
- `HIGH`: a common or important task is materially impaired.
- `MEDIUM`: recoverable friction, inconsistent feedback, or a meaningful platform regression.
- `LOW`: bounded polish defect with limited task impact.

Use `HUMAN_STUDY_REQUIRED`, not severity, for unanswered human questions.

## Human-study boundary

Agents can observe task completion, timing, state, semantics, feedback, resource use, and accessibility exposure. People must settle comprehension, discoverability, perceived trust, comfort, delight, preference, and whether the product solves the right problem.

Turn a human question into a study handoff containing the target population, task, hypothesis, success signal, environment, and artifacts already gathered.
