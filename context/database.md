# Database Architecture

> This document defines the complete database architecture for OverWatch.
>
> Prisma is the authoritative ORM.
>
> Supabase PostgreSQL is the underlying database.

---

# Architecture

```
Next.js

↓

Server Actions

↓

Repositories

↓

Prisma Client

↓

Supabase PostgreSQL
```

Prisma is responsible for all database interactions.

Supabase provides:

- PostgreSQL
- Authentication
- Storage
- Realtime
- Row Level Security

---

# ORM

Use Prisma ORM.

Never use:

```ts
supabase
    .from(...)
```

for application CRUD.

Instead:

```ts
await prisma.investigation.findMany()
```

or

```ts
await prisma.investigation.create(...)
```

All repositories must communicate through Prisma Client.

---

# Prisma Schema

The file

```
prisma/schema.prisma
```

is the authoritative database definition.

Never manually change the database schema without updating Prisma.

Every migration originates from the Prisma schema.

---

# Migration Workflow

Every schema modification follows this order.

```
schema.prisma

↓

Prisma Migration

↓

Supabase PostgreSQL

↓

Prisma Client Generation

↓

Application
```

Never create database tables manually unless recovering from an emergency.

---

# Database Provider

Provider

PostgreSQL

Hosted by

Supabase

Connection

Prisma connects using

```
DATABASE_URL
```

The Supabase JavaScript client should not be used for CRUD operations.

---

# Models

The application currently contains the following models.

## School

Stores registered schools.

Relationships

One school

↓

Many administrators

↓

Many investigations

---

## Admin

Represents authenticated administrators.

Authentication remains managed by Supabase Auth.

Admin records extend authenticated users.

---

## Investigation

Core entity.

Stores

- Submitted URL
- Processing Status
- Investigation Status
- Progress
- AI findings
- Report
- Risk score
- Confidence
- Metadata
- Completion timestamps

---

## InvestigationEvent

Append-only timeline.

Used for:

- Live investigation terminal
- Audit history
- Debugging
- Analytics

Never update existing events.

Always append.

---

## Evidence

Stores structured investigation evidence.

Examples

- Caption
- Hashtags
- Comments
- AI supporting evidence

Avoid large unstructured blobs whenever possible.

---

## AdminNote

Internal administrator comments.

Never exposed publicly.

---

# Processing Status

Backend only.

```
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

# Investigation Status

Administrator only.

```
pending_review
under_review
resolved
archived
```

---

# Progress

Integer

```
0–100
```

Backend controlled.

Frontend only displays progress.

---

# Transactions

Whenever multiple related writes occur, use Prisma transactions.

Example

Investigation Created

↓

Timeline Event Created

↓

Initial Evidence Stored

↓

Commit

Never allow partial investigation creation.

---

# Repository Pattern

Every database query must pass through a repository.

Example

```
src/lib/db/repositories/
```

Possible repositories

```
investigation.repository.ts

school.repository.ts

admin.repository.ts

evidence.repository.ts

timeline.repository.ts
```

UI components must never import Prisma directly.

---

# Prisma Client

Create a single shared Prisma client.

```
src/lib/db/prisma.ts
```

Reuse the singleton throughout the application.

Never instantiate Prisma multiple times.

---

# Row Level Security

Supabase RLS remains enabled.

Prisma operates using the server-side database connection.

Authentication decisions are enforced in application logic and Supabase Auth.

---

# Definition of Done

The database layer is complete only when:

- Prisma schema matches PostgreSQL.
- Prisma migrations apply successfully.
- Prisma Client generates without errors.
- CRUD operations use Prisma.
- No application feature uses `supabase.from()` for database access.
- Authentication continues through Supabase Auth.
- Storage continues through Supabase Storage.
- Realtime continues through Supabase services where required.

Prisma is the single ORM used throughout the application.