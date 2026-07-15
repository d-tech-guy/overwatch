# Foundation

> This document defines the architectural foundation of OverWatch.
>
> Before writing any application code, complete every setup step described here.
>
> Do **not** begin implementing features until the entire foundation has been configured and verified.

---

# Project Information

## Name

OverWatch

## Description

OverWatch is an AI-powered cyberbullying investigation platform that enables schools to investigate harmful TikTok content before online conflicts escalate into real-world incidents.

The application is designed for school administrators while allowing the public to anonymously submit TikTok URLs for investigation.

---

# Technology Stack

## Framework

- Next.js 15
- App Router
- TypeScript

## Package Manager

- pnpm

## Runtime

- Node.js LTS

## Styling

- Tailwind CSS v4
- shadcn/ui

## Icons

- Lucide React

## Animation

- Motion

## Forms

- React Hook Form
- Zod

## Database

- Supabase PostgreSQL

## Authentication

- Supabase Auth

## Storage

- Supabase Storage

## Artificial Intelligence

- Vercel AI SDK
- Google Gemini

## Tables

- TanStack Table

## Charts

- Recharts

## Notifications

- Sonner

## PDF Generation

- @react-pdf/renderer

## Deployment

- here.now

---

# Required Dependencies

Install the following packages before writing application code.

## Core

- next
- react
- react-dom
- typescript

---

## UI

- tailwindcss
- @tailwindcss/postcss
- shadcn/ui
- lucide-react
- motion
- sonner
- next-themes

---

## Forms

- react-hook-form
- zod
- @hookform/resolvers

---

## Supabase

- @supabase/supabase-js

---

## AI

- ai
- @ai-sdk/google

Never communicate directly with Gemini from components.

All AI communication must pass through the centralized AI service layer.

---

## Utilities

- clsx
- class-variance-authority
- tailwind-merge
- date-fns

---

## Data Tables

- @tanstack/react-table

---

## Charts

- recharts

---

## PDF

- @react-pdf/renderer

---

# Folder Structure

Create the following folders before development begins.

```text
app/

actions/

components/
├── ui/
├── shared/
└── layout/

features/
├── landing/
├── auth/
├── dashboard/
├── incidents/
├── investigations/
├── analytics/
└── settings/

hooks/

lib/
├── ai/
├── supabase/
├── utils/

styles/

types/

context/

public/
```

Organize code by feature.

Avoid deeply nested directories.

---

# Supabase

Supabase is responsible for:

- Authentication
- PostgreSQL Database
- Storage
- Row Level Security

Create

```text
lib/supabase/
├── client.ts
├── server.ts
└── middleware.ts
```

Never create Supabase clients inside components.

Always import from the centralized Supabase layer.

---

# Authentication

Authentication is handled entirely by Supabase Auth.

Supported Roles

- Super Administrator
- School Administrator

Public users do **not** authenticate.

Only dashboard routes require authentication.

Authentication should use secure HTTP-only cookies.

Protect administrator routes using middleware.

---

# Artificial Intelligence

All AI functionality belongs inside

```text
lib/ai/
├── index.ts
├── prompts.ts
└── investigation.ts
```

Responsibilities include

- School detection
- Harm detection
- Risk scoring
- Sentiment analysis
- Report generation

Never call Gemini directly from UI components.

---

# Environment Variables

Create a single `.env.local` file.

Required variables

```env
NEXT_PUBLIC_APP_URL=

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

GOOGLE_GENERATIVE_AI_API_KEY=

NODE_ENV=
```

Never hardcode secrets.

Validate all required variables during application startup.

---

# TypeScript

Enable strict mode.

Never use `any`.

Always define types for

- Components
- Database models
- API responses
- AI responses
- Utility functions

---

# Styling Rules

Use

- Tailwind CSS
- shadcn/ui
- Mono Sans

Requirements

- Sharp corners
- Black-and-white interface
- Minimal animations
- Border-based layouts

Never introduce rounded corners.

Avoid custom CSS unless absolutely necessary.

---

# Icons

Use Lucide React exclusively.

Maintain consistent icon sizes throughout the application.

Avoid decorative icons.

---

# Theme

Use next-themes.

Supported Themes

- Dark
- Light
- System

Default Theme

Dark

---

# Forms

Every form must use

- React Hook Form
- Zod Validation

Never submit unvalidated data.

Display clear validation errors.

---

# Notifications

Use Sonner.

Do not use browser alerts.

---

# State Management

Prefer

- Server Components
- Server Actions
- React hooks

Avoid unnecessary global state.

Keep state close to where it is used.

---

# Utilities

Create

```text
lib/
├── utils.ts
├── constants.ts
├── validators.ts
└── env.ts
```

Do not duplicate helper functions.

---

# Types

Create

```text
types/
├── user.ts
├── school.ts
├── incident.ts
├── report.ts
└── ai.ts
```

Do not define large interfaces inside components.

---

# Data Fetching

Prefer

- Server Components
- Native fetch
- Supabase queries

Avoid unnecessary client-side fetching.

---

# Security

Never expose

- Service Role Key
- Environment variables
- Internal secrets

Validate every user input.

Use Row Level Security for all protected tables.

Restrict dashboard access to authenticated administrators only.

---

# Performance

Prefer Server Components.

Minimize client-side JavaScript.

Optimize images.

Avoid unnecessary dependencies.

Lazy-load heavy components when appropriate.

---

# Code Generation Rules

Before generating code, always verify:

- Required dependency is installed.
- Environment variable exists.
- File does not already exist.
- Similar component does not already exist.
- Existing utility cannot be reused.

Never assume project state.

Inspect the repository before making changes.

---

# Project Initialization Order

Initialize the project in this exact order.

1. Create the Next.js application.
2. Install all dependencies.
3. Configure Tailwind CSS.
4. Initialize shadcn/ui.
5. Configure path aliases.
6. Create the folder structure.
7. Configure Mono Sans typography.
8. Configure environment variables.
9. Configure Supabase.
10. Configure Supabase Auth.
11. Configure middleware.
12. Configure Row Level Security.
13. Configure AI service layer.
14. Verify application builds.
15. Verify authentication.
16. Verify database connection.
17. Verify storage connection.
18. Verify AI connection.
19. Begin feature development.

Do not skip any step.

---

# Verification Checklist

Before implementing any feature, verify:

- [ ] Project builds successfully
- [ ] TypeScript passes
- [ ] ESLint passes
- [ ] Tailwind CSS is working
- [ ] shadcn/ui is configured
- [ ] Mono Sans is applied
- [ ] Theme switching works
- [ ] Supabase connects successfully
- [ ] Authentication works
- [ ] Sessions persist
- [ ] Protected routes are secured
- [ ] Row Level Security is functioning
- [ ] Storage uploads work
- [ ] AI service responds successfully
- [ ] Environment variables validate correctly
- [ ] No runtime errors exist

Only after every item has been verified should feature development begin.

---

# Guiding Principles

- Build the foundation before the interface.
- Reuse before creating.
- Simplicity over complexity.
- Consistency over convenience.
- Security by default.
- AI assists development but must follow the established architecture.
- Every implementation should be production-ready.

A stable foundation is more valuable than rapid feature development.