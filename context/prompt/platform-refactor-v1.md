# OverWatch Platform Refactor v1

> Master implementation specification for the next phase of OverWatch.

---

# 1. Vision

OverWatch is a cyber-intelligence platform for educational institutions. The product should feel like a Security Operations Center (SOC), not a CRUD dashboard.

Core principles:

- Black & white interface
- Sharp edges (no rounded corners)
- Monospace typography by default
- Native UI components where possible
- Realtime-first
- AI-assisted investigations
- Professional cyber-forensics aesthetic

---

# 2. Guest Investigation UX

## Landing Page

Guest pastes a TikTok URL and starts an investigation.

Workflow:

1. Validate URL.
2. Create investigation.
3. Persist to database.
4. Open investigation modal.
5. Stream realtime terminal updates.
6. Allow:
   - Cancel Investigation
   - Run in Background

## Background Mode

If "Run in Background" is selected:

- Investigation continues.
- Modal closes.
- User returns to landing page.
- Floating Investigation Dock appears.
- Multiple investigations can run concurrently.

## Investigation Dock

Bottom-right floating panel.

Each investigation displays:

- Investigation ID
- Current stage
- Progress %
- Elapsed time
- Current task
- Resume button
- Cancel button

Collapsed state:

ACTIVE (N)

---

# 3. Investigation Pipeline

Stages:

- Queued
- Validating URL
- Creating Investigation
- Fetching Video Metadata
- Fetching Profile
- Fetching Comments
- Preparing AI Context
- Calling Gemini
- AI Analysis Complete
- Generating Report
- Saving Results
- Completed
- Failed

Progress must update smoothly from 0–100%.

---

# 4. Terminal

Replace fake logs with backend-driven logs.

Display:

- Investigation ID
- Public ID
- Current Stage
- Progress
- Elapsed Time
- Provider Status
- AI Status

Example:

✓ URL validated

✓ Investigation created

Connecting to Apify...

Video metadata received

Launching Profile Scraper...

100 comments retrieved

Submitting evidence to Gemini...

Generating report...

Investigation complete.

---

# 5. Report

Sections:

- Investigation Summary
- TikTok Metadata
- Creator Profile
- School Analysis
- AI Assessment
- Timeline
- Evidence
- Executive Summary
- Detailed Analysis
- Recommended Administrative Action
- Investigation Metadata

Include:

- Caption
- Author
- Display name
- Upload time
- Views
- Likes
- Shares
- Comments
- Hashtags
- Mentioned schools
- Target school
- Severity
- Risk score
- Confidence
- Sentiment
- Bullying classification
- Evidence list
- Processing duration

---

# 6. Authentication

School administrators only.

## Request Access

Collect:

- School Name
- School Type
- School Email
- Administrator Name
- Administrator Role
- Administrator Email
- Phone Number

No document upload.

Display message explaining manual verification.

Application status:

Pending Verification

Approved

Rejected

Only approved administrators may sign in.

---

# 7. Admin Console

Routes:

/admin

/admin/investigations

/admin/threat-intelligence

/admin/raids

/admin/reports

/admin/settings

Landing page:

Operations Center

Cards:

- Open Investigations
- Critical Incidents
- Videos Analysed Today
- Schools Mentioned
- Average Severity

Realtime activity feed.

---

# 8. Raid Engine

Administrators can launch raids.

Inputs:

- School
- Keywords
- Hashtags
- Time Range
- Maximum Videos

Pipeline:

Search TikTok

↓

Collect videos

↓

Filter relevance

↓

AI analysis

↓

Auto-create investigations

Terminal should stream every step.

---

# 9. GOD Console

Accessible ONLY when:

GOD_EMAIL and GOD_ACCESS_CODE environment variables match.

Never hardcode credentials.

Capabilities:

- Approve school administrators
- Reject applications
- View every investigation
- View all schools
- System health
- AI usage
- Metadata provider health
- Platform analytics
- Investigation metrics
- Revoke access

Routes:

/god

/god/applications

/god/schools

/god/investigations

/god/system

/god/settings

---

# 10. Shared UX

Entire platform should use:

- Realtime updates
- Keyboard accessibility
- Loading skeletons
- Empty states
- Error states
- Toast notifications
- Responsive layouts
- Sharp monochrome design
- Consistent spacing

---

# 11. Notifications

Examples:

✓ Investigation Completed

✓ Administrator Approved

⚠ High Severity Incident

⚠ AI Failure

✓ Raid Complete

---

# 12. Data Architecture

Persist:

- Investigation
- Terminal logs
- Timeline
- Metadata
- Profile
- Comments
- AI JSON
- Report
- Progress
- Status

Nothing important should exist only in memory.

---

# 13. Definition of Done

A feature is complete only when:

- Functional
- Responsive
- Accessible
- Realtime enabled
- Persisted
- Error handled
- Loading states implemented
- Empty states implemented
- Mobile compatible
- Matches OverWatch visual language

This document supersedes previous UX specifications for the current development phase.
