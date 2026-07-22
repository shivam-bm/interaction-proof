# Evidence Privacy

Collect the smallest artifact that proves the claim.

## Before capture

- Prefer synthetic accounts and seeded data.
- Identify personal data, credentials, customer content, location, health, financial, and proprietary information that may appear.
- Choose a bounded capture window and storage location.
- Confirm authority before accessing production or another person's data.

## During capture

- Keep tokens, cookies, authorization headers, environment secrets, private URLs, and device identifiers out of visible output.
- Frame screenshots and recordings around the interaction under test.
- Disable unrelated notifications and overlays.
- Record artifact sensitivity and intended retention.

## Before sharing or committing

Run `scripts/redact-evidence.mjs <text-file>` for text evidence, then inspect the result manually. Redaction is a safety net, not proof that content is safe.

For images and video, blur or crop sensitive regions with an approved tool while preserving the behavior under test. Keep originals only when required and authorized.

## Report

Reference artifacts by stable identifier and sensitivity. State where the artifact lives, who may access it, and whether it is safe to publish. Use a concise textual observation when the artifact itself cannot be shared.
