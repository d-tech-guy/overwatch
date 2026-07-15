# Workflow

## Overview

OverWatch is designed around two primary user journeys:

1. Public Incident Reporting
2. School Administration

The reporting experience is intentionally simple to encourage participation, while the administration experience provides the tools required to investigate and resolve incidents.

---

# Workflow 1 — Public Reporting

Anyone can report a suspicious TikTok post.

Authentication is not required.

Flow:

Landing Page

↓

Paste TikTok URL

↓

Submit Report

↓

Incident Created

↓

AI Investigation Begins

↓

Confirmation Message

The public user's journey ends after the report is submitted.

---

# Workflow 2 — AI Investigation

After a report is submitted, OverWatch automatically begins processing the incident.

Flow:

Incident Created

↓

Retrieve Public TikTok Data

↓

Extract Available Information

↓

AI Analysis

↓

Generate Investigation Report

↓

Assign Risk Score

↓

Mark Investigation Complete

↓

Notify Dashboard

The report is now available for administrator review.

---

# Workflow 3 — Administrator Review

School administrators review completed investigations.

Flow:

Login

↓

Dashboard

↓

Open Incident

↓

Review AI Report

↓

Review Evidence

↓

Choose Outcome

↓

Save Resolution

Possible outcomes include:

- Confirmed Bullying
- False Positive
- Insufficient Evidence
- Escalated
- Closed

---

# Workflow 4 — Investigation Notes

Administrators may document their findings throughout an investigation.

Flow:

Open Incident

↓

Add Note

↓

Save Note

↓

Continue Investigation

Notes become part of the permanent investigation record.

---

# Workflow 5 — Incident Resolution

Every investigation concludes with a final resolution.

Flow:

Investigation Complete

↓

Administrator Decision

↓

Record Outcome

↓

Archive Investigation

↓

Available for Future Reference

Resolved incidents remain searchable for historical and analytical purposes.

---

# Dashboard Workflow

After authentication, administrators are taken directly to the dashboard.

The dashboard provides quick access to:

- Recent incidents
- High-risk investigations
- Investigation queue
- Analytics
- Search

From the dashboard, administrators can navigate directly to any investigation.

---

# AI Processing Status

Every incident progresses through predefined processing stages.

Queued

↓

Processing

↓

Generating Report

↓

Completed

If processing fails:

Failed

↓

Retry Investigation

---

# Error Handling

Invalid TikTok URL

↓

Reject Submission

↓

Display Helpful Error

---

AI Failure

↓

Mark Incident as Failed

↓

Allow Manual Retry

---

TikTok Data Unavailable

↓

Store Incident

↓

Notify Administrator

↓

Retry Later

---

# Design Principles

- Reporting should take less than one minute.
- AI processing should require no user interaction.
- Administrators should understand an incident within seconds.
- Every investigation should end with a recorded outcome.
- Human review is required before any disciplinary action.