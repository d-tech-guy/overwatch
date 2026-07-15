# Personal Development Preferences

This document contains development preferences that should always be respected when working on OverWatch.

---

# ORM

This project uses **Prisma ORM** as the primary interface for interacting with the PostgreSQL database.

Do not use the Supabase JavaScript client for standard CRUD operations.

Instead:

```
Server Action
        ↓
Prisma Client
        ↓
Supabase PostgreSQL
```

The Supabase client should only be used for services that Prisma cannot provide, including:

- Authentication
- Storage
- Realtime
- Edge Functions (if introduced)
- Session Management

---

# Database Philosophy

Prisma is the application's data layer.

Supabase is the infrastructure provider.

Business logic should never contain raw SQL unless absolutely necessary.

Repository functions should use Prisma Client.

---

# Code Style

Always:

- Prefer Prisma queries over raw SQL.
- Keep database access inside repositories or services.
- Avoid duplicate queries.
- Use transactions where multiple writes occur.
- Keep Prisma schema synchronized with the database.

Never:

- Mix Prisma and Supabase CRUD in the same feature.
- Query the database directly from React components.
- Bypass repositories.

---

# Development Workflow

When changing the database:

1. Update `prisma/schema.prisma`
2. Generate a Prisma migration.
3. Apply the migration.
4. Regenerate Prisma Client.
5. Update generated types if necessary.

Never modify the database manually unless explicitly instructed.

---

# Source of Truth

The Prisma schema is the authoritative definition of the application's data model.

Generated migrations must always originate from the Prisma schema.

Database structure should never drift from Prisma.