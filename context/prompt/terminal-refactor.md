# OverWatch Engineering Specification
# Investigation Terminal Reliability Refactor
Version: 2.0

Status: REQUIRED

Priority: CRITICAL

---

# Purpose

The Investigation Terminal is currently unreliable.

The backend investigation pipeline is executing correctly, however the frontend terminal is not reflecting the actual execution state.

This breaks one of the primary UX goals of OverWatch.

The terminal must become a truthful representation of the backend investigation pipeline.

Do not redesign the UI.

Do not change the layout.

Only refactor the architecture and implementation.

---

# Current Issues

The following issues have been observed.

- Investigation starts successfully.
- Background processing begins.
- Server logs clearly show work being executed.
- The terminal remains mostly empty.
- Terminal events do not stream in realtime.
- Errors occurring during investigations are not displayed.
- Users receive no feedback when a stage fails.
- The terminal sometimes appears frozen despite backend activity.

These are architectural issues.

---

# Source of Truth

The backend is the source of truth.

Never generate terminal output from frontend timers.

Never fabricate progress.

Never simulate events.

Every terminal line must originate from a real backend event.

---

# Terminal Architecture

The architecture must be

```
Investigation Worker

↓

Stage Begins

↓

Persist Investigation Event

↓

Broadcast Realtime Event

↓

Frontend Subscription Receives Event

↓

Append Terminal Line

↓

Auto Scroll
```

The frontend should never invent logs.

---

# Investigation Events

Every meaningful backend operation should generate an Investigation Event.

Examples include

Investigation Created

Metadata Fetch Started

Metadata Retrieved

Metadata Failed

Downloading Comments

Comments Retrieved

Fetching Profile

Profile Retrieved

Sending Prompt To Gemini

Gemini Response Received

Risk Analysis Started

Risk Analysis Complete

Report Generation Started

Report Generated

Saving Report

Investigation Completed

Investigation Failed

Background Job Started

Background Job Completed

Retry Started

Retry Failed

Cancellation Requested

Cancelled

Every event should be persisted before being broadcast.

---

# Investigation Event Model

Every event should contain

Investigation ID

Timestamp

Stage

Severity

Type

Short Message

Detailed Message

Progress %

Duration (if available)

Correlation ID

Metadata JSON

The frontend should render from these records.

---

# Realtime Subscription

Audit the realtime implementation.

Verify

- Supabase Realtime subscription is active.
- Correct channel is subscribed.
- Correct investigation ID filter is applied.
- Events are received.
- Duplicate subscriptions are prevented.
- Reconnect logic exists.
- Missed events are replayed from the database.

The terminal must continue functioning after reconnecting.

---

# Initial Event Replay

When the investigation modal opens,

query all existing Investigation Events first.

Render them immediately.

Then begin listening for realtime updates.

This prevents missing events that occurred before the subscription became active.

Flow

```
Open Modal

↓

Load Existing Events

↓

Render History

↓

Subscribe To Realtime

↓

Append New Events
```

---

# Terminal Rendering

Every event should appear immediately.

Display

Timestamp

Stage

Severity

Operation

Short Description

Duration (if available)

Each event should animate into view.

No polling.

Realtime only.

---

# Auto Scroll

The terminal should automatically scroll while events arrive.

If the user scrolls upward,

pause automatic scrolling.

Provide

```
Resume Live
```

to return to the latest event.

---

# Progress Synchronization

The progress bar must be driven by backend events.

Never update progress using frontend timers.

Progress should always match the persisted investigation state.

---

# Error Handling

The terminal currently provides no meaningful feedback when failures occur.

This must be corrected.

Every backend error should generate a terminal event.

Display errors immediately.

Examples

```
[ERROR]

Gemini request failed.

Retrying...

```

```
[ERROR]

TikTok metadata unavailable.

Continuing with partial investigation.

```

```
[WARNING]

Profile could not be retrieved.

Proceeding without profile enrichment.

```

```
[FATAL]

Investigation aborted.

Background worker terminated.

```

---

# Error Categories

Support

INFO

SUCCESS

WARNING

ERROR

FATAL

Each category should have consistent styling.

Red should only be used for

ERROR

FATAL

Amber for

WARNING

Green for

SUCCESS

Blue or Neutral for

INFO

---

# Failure Behaviour

A failed stage should not immediately crash the investigation.

Whenever possible

```
Stage Fails

↓

Persist Failure Event

↓

Display Failure

↓

Attempt Recovery

↓

Continue
```

Only terminate when recovery is impossible.

---

# Investigation Summary

If an investigation terminates unexpectedly,

display

Investigation Status

Failed Stage

Failure Reason

Completed Stages

Successful Operations

Retry Button

Download Logs

This replaces an endless loading spinner.

---

# Diagnostics

Improve backend logging.

Every stage should log

Start

Success

Failure

Duration

Payload size (where applicable)

Retry count

Correlation ID

These logs should also appear in the terminal when appropriate.

---

# Recovery

If realtime disconnects,

attempt automatic reconnection.

After reconnecting,

query any Investigation Events created while disconnected.

Append them in chronological order.

Users should never permanently lose terminal history.

---

# Completion Behaviour

When the investigation completes,

the terminal should stop streaming.

Display

```
Investigation Complete

Report Generated Successfully
```

Then automatically transition into the final report view.

---

# Success Criteria

The implementation is complete only when

✓ Every backend stage creates Investigation Events.

✓ Events are persisted.

✓ Events are streamed through Supabase Realtime.

✓ The terminal immediately reflects backend activity.

✓ Historical events are loaded when the modal opens.

✓ No backend work occurs without corresponding terminal output.

✓ Errors are displayed in realtime.

✓ Recoverable failures continue processing where possible.

✓ Fatal failures terminate gracefully with meaningful diagnostics.

✓ The investigation terminal becomes a truthful live view of the backend execution pipeline.