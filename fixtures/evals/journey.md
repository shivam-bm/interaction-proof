# Add Customer journey

## Product contract

- Person: field representative.
- Task: start from Home, enter customer details, choose an address, review, submit, and reach the customer record.
- The journey must preserve entered data through back navigation and recover from offline submission without duplication.
- Submission integrity and recovery are release-critical.

## Run environments

- Revision: `eval-journey`.
- iOS 19 simulator and Android API 36 emulator; release-like builds; en-US; default text; seeded representative account.
- Normal-network runs: 5 of 5 per platform reached the new customer record with one created record.
- Back-navigation runs: 3 of 3 per platform preserved name, phone, and selected address.
- Offline submission: both platforms showed an immediate offline error and retained the form; retry created one customer after reconnection.
- Repeated submit taps: the action disabled after the first accepted tap in all recorded runs.
- Source inspection identifies generated query invalidation after successful creation.

## Missing evidence

- No physical devices, screen readers, largest text, right-to-left locale, slow address search, process death, frame trace, weak hardware, tablet, or participant evidence is available.
