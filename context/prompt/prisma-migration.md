# Prisma Database Migration

## Objective

Refactor the entire OverWatch codebase to use **Prisma ORM** as the exclusive database access layer.

The project no longer uses the Supabase JavaScript client for CRUD operations.

Supabase remains responsible only for:

- Authentication
- Storage
- Realtime
- Session Management

Every database interaction must occur through Prisma Client.

---

# Required Changes

Search the entire codebase and replace every database interaction that uses the Supabase client.

This includes, but is not limited to:

- insert()
- update()
- upsert()
- delete()
- select()
- rpc()
- from()

Any code resembling:

```ts
supabase.from(...)
```

must be removed.

---

# New Architecture

The architecture must become:

```
React Component

↓

Server Action

↓

Repository

↓

Prisma Client

↓

Supabase PostgreSQL
```

React components must never access the database directly.

---

# Repository Pattern

Create repositories if they do not already exist.

Example

```
src/lib/db/repositories/
```

Suggested repositories

```
investigation.repository.ts

school.repository.ts

admin.repository.ts

evidence.repository.ts

investigation-event.repository.ts
```

Repositories become the only location where Prisma queries are allowed.

---

# Prisma Client

Create a singleton Prisma client.

Example location

```
src/lib/db/prisma.ts
```

Every repository must import this singleton.

Never instantiate multiple Prisma clients.

---

# Server Actions

Update every Server Action.

Instead of:

```ts
await supabase
    .from("investigations")
    .insert(...)
```

Use Prisma.

Example

```ts
await prisma.investigation.create(...)
```

---

# API Routes

Any API route currently using Supabase CRUD must be migrated to Prisma.

---

# Services

Update every service responsible for:

- Creating investigations
- Updating progress
- Storing AI reports
- Creating evidence
- Writing timeline events
- Administrator actions

All services must use repositories backed by Prisma.

---

# Authentication

Do NOT migrate authentication.

Continue using:

Supabase Auth

Authentication logic should remain unchanged.

Only database CRUD changes.

---

# Storage

Do NOT migrate storage.

Continue using:

Supabase Storage

Only metadata about stored files belongs in Prisma.

---

# Realtime

Continue using Supabase Realtime where required.

Prisma does not replace realtime subscriptions.

---

# Transactions

Whenever multiple writes belong to a single logical operation, replace sequential writes with Prisma transactions.

Example

Create Investigation

↓

Create Timeline Event

↓

Store Initial Evidence

↓

Commit Transaction

Never allow partial writes.

---

# Error Handling

Replace Supabase error handling with Prisma error handling.

Use:

- try/catch
- PrismaClientKnownRequestError
- meaningful server errors

Do not expose raw database errors to users.

---

# Remove Dead Code

Delete all obsolete code that exists solely for Supabase CRUD.

Remove:

- database helper wrappers
- unused utility functions
- duplicate CRUD abstractions
- obsolete imports

Do not leave compatibility layers.

---

# Validation

Preserve all existing validation.

Migration must not change business logic.

Only the persistence layer changes.

---

# Files To Update

Search the entire repository.

Update every file that performs database operations.

Including:

- Server Actions
- API Routes
- Repositories
- Services
- Utility functions
- AI processing pipeline

---

# Final Verification

Before considering the migration complete, verify:

- No `supabase.from()` calls remain.
- No CRUD operations use the Supabase client.
- All repositories use Prisma.
- Prisma Client compiles successfully.
- Application behavior remains unchanged.
- Authentication still functions through Supabase Auth.
- Storage still functions through Supabase Storage.
- Realtime still functions through Supabase Realtime.

The migration is complete only when Prisma is the exclusive ORM for all database interactions.