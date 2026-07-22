# Measurement

Pin the protocol before collecting numbers. Compare like with like.

## Environment record

Capture code revision, app version, dependency versions, platform, OS, device model, simulator or hardware, build configuration, architecture, refresh rate, power state, thermal state, data fixture, account state, network profile, locale, appearance, accessibility settings, and capture tooling.

Use `unknown` when a field cannot be recovered. Never silently omit it.

## Repetition

Separate cold, warm, and prewarmed runs. Discard setup only when the protocol says so. Use enough repetitions to expose variance; report count, median, a high percentile when the sample supports it, and worst observed result. Preserve raw samples.

## Interaction timing

Name timestamps by semantics:

- `input`: touch, click, key, or accessibility action accepted.
- `acknowledged`: visible, audible, or haptic response begins.
- `transition-start`: navigation or presentation motion begins.
- `transition-end`: motion ends.
- `interactive`: destination accepts input.
- `content-ready`: task-relevant content is available.

Do not collapse animation time, data time, and content-ready time into one number.

## Motion

Record target refresh rate, frame intervals, hitch count or ratio, dropped or late frames, duration, cancellation behavior, and final state. Test interactive gestures in both directions and at slow and fast velocities.

Apple's public responsiveness guidance uses rough targets below 100 ms for synchronous work after a discrete interaction and one display interval for continuous interaction. Verify current platform guidance when setting release budgets:

- https://developer.apple.com/documentation/xcode/improving-app-responsiveness
- https://developer.apple.com/documentation/xcode/understanding-hitches-in-your-app

## Device evidence

Use physical hardware for release performance verdicts. Simulator evidence is useful for behavior and layout, but it does not reproduce device GPU, thermal, refresh-rate, memory, haptic, camera, or sensor behavior.

Include weak supported hardware, a representative current device, constrained layout, and high-refresh hardware when the product supports it.

## Network and asynchronous work

Exercise normal, slow, offline, timeout, cancellation, retry, duplicate response, stale response, and authentication-expiry conditions when they can affect the task. Record whether feedback begins immediately even when completion is remote.

## Comparison

Use the same environment, fixture, build type, steps, capture tools, and repetition count for baseline and candidate. When they differ, describe the mismatch before interpreting the delta.
