# Landing Page Engineering Specification

## Feature

Public TikTok Incident Reporting

---

# Objective

Allow any visitor to submit a public TikTok URL for AI-assisted investigation without authentication.

The system should immediately create an investigation record, launch the investigation pipeline, stream investigation progress in real time, generate a structured report, and store all findings for administrator review.

The landing page should function as a public investigation terminal rather than a traditional marketing homepage.

---

# Actors

## Guest User

Unauthenticated visitor.

Responsibilities

- Submit TikTok URL
- Observe investigation progress
- Review generated investigation summary

Guest users cannot

- View previous investigations
- Access dashboard
- Edit reports

---

## Background Worker

Responsible for

- Fetching TikTok metadata
- Running AI analysis
- Updating investigation progress
- Generating structured report
- Persisting findings

---

## Administrator

Not part of this interaction.

Administrators consume the completed investigation later through the protected dashboard.

---

# State Machine

```
IDLE
    ↓
URL_VALIDATION
    ↓
INVESTIGATION_CREATED
    ↓
QUEUE_BACKGROUND_JOB
    ↓
FETCH_METADATA
    ↓
AI_ANALYSIS
    ↓
GENERATE_REPORT
    ↓
SAVE_RESULTS
    ↓
COMPLETE
```

Every state transition must be persisted in the database.

The frontend must never rely on local component state as the source of truth.

---

# State 1 — Idle

Trigger

User opens "/"

Frontend

Render

- Navigation
- Hero
- TikTok URL input
- Disabled REPORT INCIDENT button

Input

Focused automatically on desktop.

No network requests should occur.

Exit Condition

Valid TikTok URL entered.

---

# State 2 — URL Validation

Trigger

Input changes.

Frontend

Validate using Zod.

Requirements

- Required
- Valid URL
- TikTok hostname
- No empty string

Invalid

Display validation message.

Button remains disabled.

Valid

Display success indicator.

Enable REPORT INCIDENT button.

Exit Condition

User clicks REPORT INCIDENT.

---

# State 3 — Create Investigation

Trigger

REPORT INCIDENT clicked.

Frontend

Disable button.

Prevent duplicate submissions.

Display loading state.

Server Action

Generate UUID.

Insert new investigation.

Fields

- id
- url
- submitted_by = Guest
- status = queued
- progress = 0
- created_at

Return

- investigation_id

Database

INSERT investigations

Success

Open Investigation Terminal.

Failure

Display retry message.

---

# State 4 — Investigation Terminal

Immediately replace the landing page interaction with a fullscreen modal.

The modal becomes the active interface.

Display

Investigation ID

Current Status

Progress Bar

Timeline

The modal cannot be closed while the investigation is running.

---

# State 5 — Queue Background Job

Backend

Start asynchronous investigation pipeline.

Immediately update

status

queued

↓

fetching_metadata

Database

Persist state change.

Frontend

Subscribe to investigation updates using Supabase Realtime.

Never poll continuously if realtime is available.

---

# State 6 — Fetch TikTok Metadata

Background Worker

Retrieve

- Caption
- Author
- Username
- Video URL
- Upload timestamp
- Hashtags
- Engagement metrics
- Public comments (if available)

Persist raw metadata.

Database

Update

metadata

status = metadata_complete

progress = 20

Realtime

Timeline

✓ Metadata Retrieved

---

# State 7 — AI Investigation

Trigger

Metadata complete.

AI

Analyze

Caption

Comments

Hashtags

School references

Insults

Threats

Bullying

Harassment

Violence

Discrimination

Context

Return

Risk score

Severity

Detected school

Confidence

Supporting evidence

Explanation

Recommended action

Never return plain text.

Return structured JSON only.

Persist AI response.

Progress

60

Timeline

✓ AI Analysis Complete

---

# State 8 — Generate Report

Backend

Transform AI JSON into investigation report.

Populate

Summary

Evidence

Risk

Findings

Recommendations

Store report.

Progress

80

Timeline

✓ Investigation Report Generated

---

# State 9 — Complete Investigation

Update investigation.

status = completed

progress = 100

completed_at

Realtime

Timeline

✓ Investigation Completed

Terminal automatically transitions into results view.

---

# Results View

Display

Investigation ID

Submission Time

Detected School

Detected Location (if inferable)

Caption Summary

Detected Hashtags

Risk Score

Severity

Confidence

Evidence Summary

Recommended Action

Every AI conclusion must include supporting evidence.

Display disclaimer

"AI-generated findings assist administrators and should be reviewed before disciplinary action."

---

# Finish Action

Button

FINISH

Trigger

User clicks button.

Frontend

Close modal.

Reset landing page.

Clear input.

Focus URL field.

No investigation data should remain in component state.

---

# Failure Handling

If investigation creation fails

Display

Unable to create investigation.

Retry button.

---

If metadata retrieval fails

Update status

failed_metadata

Timeline

✕ Metadata Retrieval Failed

Allow administrator review later.

---

If AI fails

Update status

failed_ai

Timeline

✕ AI Analysis Failed

Persist investigation.

Do not delete record.

---

# Realtime

Frontend subscribes to

investigations/{id}

Every update should

Refresh progress

Append timeline

Refresh status

Refresh report

Never refresh the page.

---

# Accessibility

Keyboard accessible.

Focus trapped inside modal.

Escape disabled while investigation is active.

Announce progress updates to screen readers.

---

# Performance

The landing page should remain interactive.

Background processing must never block rendering.

Heavy work must occur outside the request lifecycle.

---

# Security

Validate every submitted URL.

Never trust client input.

Store only public TikTok information.

Never expose service role credentials to the client.

All privileged operations must execute on the server.

---

# Definition of Done

The feature is complete only when:

- Guest can submit a TikTok URL.
- Investigation is immediately created.
- Investigation is persisted in the database.
- Realtime updates stream to the terminal.
- AI analysis executes successfully.
- Structured report is generated.
- Results are displayed.
- Investigation is available to administrators.
- Landing page resets cleanly after completion.
- All failure states are handled gracefully.