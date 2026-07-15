# Database Specification

> This document is the single source of truth for the OverWatch database architecture.
>
> Every SQL migration, Supabase table, TypeScript type, repository, server action, and Row Level Security policy must be generated from this specification.
>
> If implementation conflicts with this document, this document takes precedence.

---

# Purpose

The database stores every investigation submitted to OverWatch.

It must support:

- Anonymous public submissions
- AI investigation pipeline
- Administrator review
- Audit history
- Future analytics
- Secure Row Level Security

The database is the authoritative source of truth.

Frontend state must never be considered authoritative.

---

# Database Provider

Supabase PostgreSQL

Features used:

- PostgreSQL
- Row Level Security
- Authentication
- Storage
- Realtime (Authenticated Dashboard)
- SQL Migrations

---

# Design Principles

The schema must satisfy the following principles.

- Normalize related data.
- Avoid duplicate information.
- Preserve investigation history.
- Separate AI processing from administrator actions.
- Use foreign keys wherever appropriate.
- Never rely on frontend state.
- Every investigation must be recoverable.

---

# Enumerations

## Processing Status

Represents the automated investigation pipeline.

Managed only by the backend.

Allowed values:

```text
queued
fetching_metadata
metadata_complete
analyzing
report_generating
completed
failed_metadata
failed_ai
```

---

## Investigation Status

Represents administrator workflow.

Managed only by authenticated administrators.

Allowed values:

```text
pending_review
under_review
resolved
archived
```

---

## Severity

Represents AI severity assessment.

Allowed values:

```text
low
medium
high
critical
```

---

# Tables

---

# admins

Purpose

Stores authenticated school administrators.

Authentication is handled by Supabase Auth.

This table extends auth.users.

Columns

- id (UUID, Primary Key, references auth.users.id)
- full_name
- email
- school_id
- role
- created_at
- updated_at

Relationships

Many administrators belong to one school.

---

# schools

Purpose

Stores schools known to OverWatch.

Columns

- id
- name
- short_name
- state
- country
- logo_url
- created_at
- updated_at

Relationships

One school has many administrators.

One school may appear in many investigations.

---

# investigations

Purpose

Represents a single reported TikTok investigation.

This is the core entity of the system.

Columns

Identity

- id
- public_id
- created_at
- updated_at
- completed_at

Submission

- submitted_url
- submitted_by (Guest)
- submission_ip_hash (optional)

Processing

- processing_status
- investigation_status
- progress

TikTok Metadata

- author_username
- caption
- upload_timestamp
- hashtags
- comment_count
- like_count
- share_count

AI Findings

- detected_school_id
- detected_location
- sentiment
- severity
- risk_score
- confidence_score

Structured Report

- summary
- recommendation
- explanation

Debug

- ai_response_json

Relationships

Many investigations belong to one school.

One investigation has many timeline events.

One investigation has many evidence records.

One investigation has many administrator notes.

---

# investigation_events

Purpose

Stores every significant event during an investigation.

This table powers:

- Live Investigation Terminal
- Audit History
- Debugging
- Future Analytics

Columns

- id
- investigation_id
- event
- description
- progress
- created_at

Examples

Investigation Created

Metadata Retrieval Started

Caption Extracted

Comments Retrieved

AI Analysis Started

Risk Score Calculated

Report Generated

Investigation Completed

Relationships

Many events belong to one investigation.

Events are append-only.

Never update or delete events.

---

# evidence

Purpose

Stores structured evidence collected during investigations.

Avoid storing large unstructured blobs inside investigations.

Columns

- id
- investigation_id
- type
- content
- source
- created_at

Supported Types

caption

hashtag

comment

metadata

ai_evidence

Relationships

Many evidence records belong to one investigation.

---

# admin_notes

Purpose

Allows administrators to leave internal notes.

These notes are never visible publicly.

Columns

- id
- investigation_id
- admin_id
- note
- created_at
- updated_at

Relationships

Many notes belong to one investigation.

Many notes belong to one administrator.

---

# Relationships

School

↓

Administrators

School

↓

Investigations

Investigation

↓

Timeline Events

Investigation

↓

Evidence

Investigation

↓

Administrator Notes

---

# Indexes

Create indexes for:

investigations.processing_status

investigations.investigation_status

investigations.detected_school_id

investigations.created_at

investigations.public_id

investigation_events.investigation_id

evidence.investigation_id

admin_notes.investigation_id

These indexes are required for dashboard performance.

---

# Row Level Security

Enable Row Level Security on every table.

---

## Public

Anonymous users may:

Create investigations.

Anonymous users may not:

Read investigations.

Read administrator data.

Read evidence.

Read notes.

Read timeline history.

---

## Administrators

Authenticated administrators may:

Read investigations.

Read evidence.

Read timeline.

Read schools.

Create notes.

Update investigation status.

Administrators may not:

Modify AI findings.

Modify investigation history.

Delete investigations.

---

## Backend

Service Role may:

Create investigations.

Update investigations.

Insert evidence.

Insert timeline events.

Generate reports.

Update progress.

Service Role bypasses RLS where appropriate.

---

# Investigation Lifecycle

Investigation Created

↓

Queued

↓

Fetching Metadata

↓

Metadata Complete

↓

Analyzing

↓

Generating Report

↓

Completed

↓

Pending Review

↓

Under Review

↓

Resolved

↓

Archived

Every transition must be written to:

investigations

AND

investigation_events

---

# Progress

Range

0–100

Backend controlled.

Suggested milestones:

0

Investigation Created

20

Metadata Retrieved

60

AI Analysis Complete

80

Report Generated

100

Completed

---

# Storage

Supabase Storage

Bucket

```text
evidence
```

Future uploads may include:

Screenshots

Supporting documents

Evidence exports

Generated PDFs

Storage should not be required for MVP functionality.

---

# Realtime

Realtime is used only for authenticated administrator dashboards.

Anonymous investigation progress should use a secure server-driven mechanism (such as Server-Sent Events) rather than exposing database subscriptions.

---

# Generated Types

After every schema change:

1. Apply migration.
2. Verify tables exist.
3. Regenerate Supabase TypeScript types.
4. Update Zod schemas.
5. Update repositories.
6. Update server actions.

Never manually edit generated database types.

---

# Migration Order

Apply migrations in the following order.

1. Enumerations

2. Schools

3. Admins

4. Investigations

5. Investigation Events

6. Evidence

7. Admin Notes

8. Indexes

9. Row Level Security

10. Storage Buckets

11. Seed Data (Optional)

12. Generate Types

---

# Definition of Done

The database is considered complete only when:

- Every table exists in Supabase.
- Every foreign key is valid.
- Every index exists.
- Row Level Security is enabled.
- Anonymous users can create investigations only.
- Administrators can review investigations.
- Timeline events are recorded.
- Evidence records are stored correctly.
- Progress updates persist.
- Supabase types are regenerated successfully.
- No schema mismatches exist between the database and TypeScript.

No application feature should be implemented until every requirement in this document has been satisfied.