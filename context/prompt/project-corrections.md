# Project Corrections

> **Purpose**
>
> This document overrides outdated assumptions, previous implementation decisions, and conflicting instructions.
>
> If any document, generated code, or previous conversation conflicts with this file, **this file takes precedence**.
>
> The goal is to keep the entire codebase internally consistent.

---

# Current Architecture

The following decisions are final.

Do not revert them unless explicitly instructed.

---

# Authentication

## Decision

Use **Supabase Auth**.

Do **not** use Better Auth.

Supabase is responsible for:

- Authentication
- Session Management
- User Management
- Route Protection
- Row Level Security integration

Remove any remaining references to Better Auth.

---

# Database

Use Supabase PostgreSQL.

The database is the single source of truth.

All investigation state changes must be persisted.

Never rely on frontend state as the authoritative source.

---

# Storage

Use Supabase Storage.

Do not introduce another storage provider.

---

# AI Provider

Use **Google Gemini** through the **Vercel AI SDK**.

Required packages

- ai
- @ai-sdk/google

Do not use:

- Azure AI Foundry
- Microsoft Foundry
- OpenAI
- Anthropic
- Groq
- OpenRouter

unless explicitly requested in the future.

The AI layer must remain provider-independent.

All AI interactions must pass through:

```
lib/ai/
```

Never call Gemini directly from UI components.

---

# Investigation Pipeline

The backend owns the investigation lifecycle.

The client never performs investigation logic.

Workflow

Guest

↓

Create Investigation

↓

Backend starts InvestigationService

↓

Metadata Retrieval

↓

AI Analysis

↓

Report Generation

↓

Persist Results

↓

Complete

The frontend only displays progress.

---

# Background Processing

Do not couple the application to Trigger.dev, Inngest, QStash, Azure Functions, or any external job runner.

Instead:

Create an `InvestigationService`.

Example

```ts
InvestigationService.start(id)
```

The implementation should be abstract enough that a dedicated background worker can be introduced later without changing business logic.

---

# Realtime Updates

The public landing page must **not** subscribe to the entire investigations table.

Guests should only receive updates for the investigation they initiated.

Prefer a secure architecture over convenience.

If realtime cannot be implemented securely for anonymous users, use Server-Sent Events (SSE) or another server-driven mechanism.

Never expose investigation data publicly.

---

# Status Model

Do not overload a single status field.

Maintain two independent workflows.

## Processing Status

Managed by the system.

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

Managed by administrators.

```text
pending_review
under_review
resolved
archived
```

Both values must be stored independently.

---

# Progress

Every investigation must include:

```text
progress
```

Range

0–100

The backend is responsible for updating progress.

The frontend displays progress.

---

# Landing Page

The landing page is a **public reporting terminal**.

It is **not** a marketing page.

Primary objective

Allow anyone to submit a TikTok URL.

Do not add:

- Testimonials
- Pricing
- Feature marketing
- Long landing-page sections
- Blog content

The URL submission workflow is the primary focus.

---

# UI

Maintain the established design system.

Requirements

- Monochrome
- Sharp corners
- Mono Sans
- Border-first layouts
- Minimal animations
- Professional intelligence platform aesthetic

Avoid decorative UI.

---

# Security

Never expose

- Service Role Key
- Internal API keys
- AI credentials

Validate every submitted URL.

Use Row Level Security wherever applicable.

---

# Engineering Principles

Always:

- Build incrementally.
- Complete one feature before starting another.
- Reuse existing components.
- Reuse existing utilities.
- Inspect the repository before creating new files.
- Keep the architecture consistent.

Never introduce duplicate functionality.

---

# Source of Truth

If conflicting information exists, resolve conflicts using this priority:

1. `project-corrections.md`
2. `foundation.md`
3. Engineering specifications
4. Architecture documents
5. Code standards
6. Previous AI responses

Do not make assumptions when project documentation already provides the answer.

---

# Final Instruction

Before implementing any feature:

1. Read every file in the `/context` directory.
2. Apply the corrections defined in this document.
3. Verify that no outdated architecture remains.
4. Proceed only after the project is internally consistent.

The objective is a cohesive, production-quality application with a single, consistent architecture.