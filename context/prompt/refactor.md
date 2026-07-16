# Critical Refactor Required

The current implementation does **not** satisfy the authentication and investigation UX specifications.

The following items are mandatory before the project can be considered complete.

---

# 1. Complete the Institution Authentication System

The existing authentication implementation is incomplete.

Currently there is no complete onboarding flow for new institution administrators.

Implement the full authentication architecture exactly as defined in `02-authentication.md`.

The application must support the following flow.

Landing Page

↓

Admin clicks
"Admin Portal"

↓

Admin chooses
"Register Institution"

↓

Institution Registration Form

↓

Submission stored in database

↓

Status = Pending Verification

↓

User shown pending approval page

↓

Platform Administrator manually reviews application

↓

Platform Administrator approves

↓

Institution account becomes active

↓

Administrator can sign in

---

## Institution Registration Form

Create a dedicated registration page.

Collect the following information.

Institution Name

Institution Type

Official School Email

Administrator Full Name

Administrator Position

Administrator Email

Administrator Phone Number

School Website (optional)

School Address

State

Country

Reason for joining OverWatch

Agreement checkbox

No document upload is required.

Verification is performed manually outside the platform.

---

## Registration Status

Every institution application must have one of the following statuses.

Pending

Approved

Rejected

Suspended

Only Approved institutions may authenticate.

---

## Authentication Pages

Build all missing routes.

- /admin
- /admin/login
- /admin/register
- /admin/pending
- /admin/rejected
- /admin/access-denied

Each page must follow the OverWatch design system.

---

## Approval Workflow

The GOD Console must contain a new section.

Institution Applications

Display

Pending Applications

Approved Institutions

Rejected Applications

Application Details

Approve

Reject

Suspend

Search

Filtering

Approval History

Audit Log

Approving an institution automatically enables authentication.

Rejecting an institution stores the reason.

---

# 2. Restore Investigation UX

The investigation experience has regressed.

Restore it to the intended architecture.

---

## Investigation Modal

Investigations should execute inside a fullscreen modal.

The landing page must remain mounted behind the modal.

Do NOT navigate away from the homepage.

Do NOT replace the page.

The modal should occupy the viewport while preserving the landing page context.

---

## Background Mode

When "Run in Background" is selected,

the modal minimizes.

It does not disappear permanently.

The investigation continues normally.

---

## Background Investigation Card

After minimization,

display a floating operational card in the bottom-right corner.

This card replaces the modal while the investigation runs.

Display

Investigation ID

Current Stage

Elapsed Time

Progress %

Current Operation

Cancel

Restore Investigation

Close (after completion)

The card should feel like a live mission tracker.

---

## Restore Modal

Clicking the background card should immediately restore the fullscreen investigation modal.

The investigation must continue from its current stage.

Nothing should restart.

---

## Investigation Terminal

The realtime terminal has regressed.

Restore the original design.

Requirements

The terminal remains inside the fullscreen investigation modal.

The terminal streams realtime backend events.

Events originate only from persisted backend events.

No simulated logs.

No fake progress.

No fabricated messages.

The terminal auto-scrolls while new events arrive.

Users may pause scrolling.

---

## Investigation Completion

When the investigation finishes,

display the final report inside the modal.

The report should replace the loading interface.

Do not redirect.

---

## Modal Dismissal

Once complete,

the user may

Close the modal

Return to landing page

Download report

Share report

Open full report page

---

## Background Card Behaviour

If the modal has been minimized,

the floating investigation card remains visible across navigation.

It should display

Current Progress

Current Stage

Elapsed Time

Severity (when available)

Completion %

Notification badge when finished

Clicking the card restores the modal.

---

## Notification Behaviour

The background card is **not** a toast notification.

It is a persistent operational widget.

It should remain visible until

the investigation completes,

is cancelled,

or is manually dismissed after completion.

---

# 3. Preserve Existing Architecture

Do not rewrite the investigation engine.

Do not remove realtime.

Do not simplify the workflow.

Refactor the implementation so that it matches the specifications contained in

- 01-investigation-engine.md
- 02-authentication.md
- 08-realtime.md
- 13-terminal-engine.md
- 14-background-job-engine.md

The goal is architectural compliance, not a workaround.