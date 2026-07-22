# Proof Contract

Apply this contract to every claim. It separates evidence from confidence theater.

## Claim types

- `source`: implementation, configuration, dependency, or documented-contract behavior.
- `runtime`: behavior observed while the software runs.
- `human`: comprehension, learnability, comfort, desirability, trust, or preference.

## Outcomes

- `PASS`: evidence meets or exceeds the claim's target rung and supports the expectation.
- `FAIL`: evidence meets or exceeds the claim's target rung and contradicts the expectation.
- `BLOCKED`: a named missing prerequisite prevents resolution.
- `NOT_APPLICABLE`: the condition does not apply, with a reason.
- `HUMAN_STUDY_REQUIRED`: observable evidence cannot answer the human question.

Resolved runtime claims use `RUN`, `DEVICE`, `TRACE`, or `FIELD`. Source evidence can resolve source claims and can narrow a runtime hypothesis; keep the runtime claim `BLOCKED` until runtime evidence exists. Human claims use `HUMAN_STUDY_REQUIRED` until research evidence exists.

Every `PASS` or `FAIL` meets its per-claim `proofTarget`. Every evidence identifier points to an artifact or exact source location. Every environment identifier resolves to a pinned environment record. Every claim includes a reproducible step or protocol.

Use the canonical claim fields in [coverage-ledger.md](coverage-ledger.md) and the representations in [verdict-format.md](verdict-format.md).

## Confidence

- `high`: direct, repeatable evidence in the target environment.
- `medium`: direct evidence with a material environment mismatch or limited repetitions.
- `low`: indirect evidence that narrows the hypothesis without settling it.

Lower confidence when evidence weakens. When evidence conflicts, preserve both artifacts and prefer the evidence closest to the target runtime.

## Severity

Assess four dimensions independently:

- **Impact:** consequence for the person or their data.
- **Reach:** affected people, devices, states, or task frequency.
- **Reproducibility:** consistency under the pinned protocol.
- **Confidence:** strength of the proof.

Issue one level for `FAIL`:

- `BLOCKER`: crash, data loss, essential task failure, or essential accessibility path unavailable.
- `HIGH`: a common or important task is materially impaired.
- `MEDIUM`: recoverable friction, inconsistent feedback, or a meaningful platform regression.
- `LOW`: bounded polish defect with limited task impact.

Use `HUMAN_STUDY_REQUIRED` for unanswered human questions.

## Human-study boundary

Agents can observe task completion, timing, state, semantics, feedback, resource use, and accessibility exposure. People settle comprehension, discoverability, perceived trust, comfort, delight, preference, and whether the product solves the right problem.

Turn a human question into a handoff containing the target population, task, hypothesis, success signal, environment, and gathered artifacts.
